const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')
const DL = require('../util/dl')



const SYMBOLS = {
    REROLL: '🌀',
    SWAP: '🤝'
}

const DEF_OPS = {
    ATT: ['Lion', 'Finka', 'Dokkaebi', 'Zofia', 'Ying', 'Blitz', 'IQ', 'Twitch', 'Montagne', 'Ash', 'Thermite', 'Sledge', 'Thatcher', 'Capitao', 'Jackal', 'Hibana', 'Blackbeard', 'Glaz', 'Fuze', 'Buck', 'Recruit', 'Recruit (Full Engage)', 'Recruit (Only Real)'],
    DEF: ['Vigil', 'Ela', 'Lesion', 'Jäger', 'Bandit', 'Rook', 'Doc', 'Pulse', 'Castle', 'Tachanka', 'Kapkan', 'Frost', 'Smoke', 'Mute', 'Caveira', 'Echo', 'Valkyrie', 'Mira', 'Recruit', 'Recruit', 'Recruit(Full Engage)']
}

const REROLL_COOLDOWN = 12 * 3600 * 1000 // 12 hours
const SWAP_COOLDOWN = 12 * 3600 * 1000 // 12 hours
const SWAP_EXPIRE = 60 * 1000 // 60 seconds

const ALLOWED_HOSTS = [
    'https://pastebin.com/',
    'https://github.com/',
    'https://gist.github.com/',
    'https://zekro.de/'
]


var OPS = {}
var activeMsgs = {}
var last = false
var ops = []
var swaps = {}


client.on('messageReactionAdd', (reaction, user) => {
    let msg = Object.values(activeMsgs).find(m => m.id == reaction.message.id)
    if (msg && user != client.user) {
        switch (reaction.emoji.name) {
            case SYMBOLS.REROLL:
                reroll(msg)
                break
            case SYMBOLS.SWAP:
                msg.member = msg.member.guild.members.find(m => m.id == user.id)
                swap(msg)
                break
        }
        reaction.remove(user)
    }
})


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function get_time(time) {
    let h = time / 3600000
    let m = (time % 3600000) / 60000
    return `${`${h}`.split('.')[0]} hours, ${`${m}`.split('.')[0]} minutes` //`
}

function getOps(defenders, msg, args) {
    let vc = msg.member.voiceChannel
    let chan = msg.channel
    let guild = msg.member.guild

    if (!vc) {
        Embeds.error(chan, 'You need to be in a voice channel to perform this command!', 'ERROR')
        return
    }

    last = defenders

    ops = defenders ? shuffle(OPS.DEF) : shuffle(OPS.ATT)

    let rands = {}

    let ind = 0
    vc.members.filter(_m => !_m.user.bot).forEach(m => {
        rands[m.displayName] = ops[ind++]
    })

    chan.send('', new Discord.RichEmbed()
        .setColor(defenders ? 0xBD4E06 : 0x0568BD)
        .setTitle(defenders ? 'DEFENDERS' : 'ATTACKERS')
        .setDescription(Object.keys(rands).map(m => {
            return `**${m}** - \`${rands[m]}\``
        }).join('\n'))
    )
    .then(m => {
        m.react(SYMBOLS.REROLL)
        setTimeout(() => m.react(SYMBOLS.SWAP), 25)
        m.member = msg.member
        activeMsgs[guild.id] = m
    })
}

function reroll(msg, args) {
    let chan = msg.channel
    let memb = msg.member
    if (args && args.length > 1) {
        memb = msg.member.guild.members.find(m => m.id == args[1].replace(/(<@!)|(<@)|>/g, ''))
        if (!memb) {
            Embeds.error(chan, 'Please enter a valid member via ID or mention!', 'Argument Error')
            return
        }
    }

    function _get_new_op() {
        let vc = msg.member.voiceChannel
        return shuffle(ops.slice(vc.members.count))[0]
    }

    Mysql.query(`SELECT * FROM r6rerolls WHERE member = '${memb.id}'`, (err, res) => {
        if (!err && res) {
            if (res.length > 0) {
                if (Date.now() < res[0].time + REROLL_COOLDOWN) {
                    Embeds.error(chan, `You can only reroll again after \`${get_time(res[0].time + REROLL_COOLDOWN - Date.now())}\``)
                    return
                }
                Mysql.query(`UPDATE r6rerolls SET time = ${Date.now()} WHERE member = '${memb.id}'`)
            } 
            else {
                Mysql.query(`INSERT INTO r6rerolls (guild, member, time) VALUES ('${memb.guild.id}', '${memb.id}', ${Date.now()})`)
            }
            Embeds.default(chan, 'Your new operator is ```' + _get_new_op() + '```\n' + `*You'll need to wait ${get_time(REROLL_COOLDOWN)} until next reroll is available!*`)
        }
    })
}

function get_rerolls(msg) {
    let guild = msg.member.guild

    Mysql.query(`SELECT * FROM r6rerolls WHERE guild = '${guild.id}'`, (err, res) => {
        if (!err && res) {
            rerolls = ''
            res.forEach(r => {
                if (Date.now() < res[0].time + REROLL_COOLDOWN) {
                    let m = guild.members.find(_m => _m.id == r.member).displayName
                    let time = get_time((res[0].time + REROLL_COOLDOWN) - Date.now())
                    rerolls += `**${m}** - \`${time}\`\n`
                }
            })
            Embeds.default(msg.channel, rerolls ? rerolls : '*Currently no reroll cooldowns are running on this guild*', 'Rerolls')
        }
    })
}

function print_help(msg) {
    Embeds.error(msg.channel, 
        'Aliases: `rand6`, `r6`, `r`\n\n' +
        '`r` - Get random ops (automatically switching between def and attack)\n' +
        '`r a` - Get random ops for defenders side\n' +
        '`r d` - Get random ops for attackers side\n' +
        '`r r [@member]` - Reroll (without arg: for yourself)\n' +
        '`r lsit` - Display list of all running reroll cooldowns on this guild\n' +
        '`r rules` - Display rules for this game\n' +
        '`r setops <url>` - Set alternative ops list\n' +
        '`r listops` - Display current ops list\n' +
        '`r help` - Display this help message'
    )
}

function print_rules(msg) {
    Embeds.default(msg.channel, 
        'Click [**here** *(GitHub)*](https://github.com/zekroTJA/docs/blob/master/etc/random6siege_rules.md) to read rules.',
        'Random6Siege Rules'
    )
}

function set_ops(msg, args) {
    let chan = msg.channel
    let guild = msg.member.guild

    if (args[1] && args[1] == 'reset') {
        Mysql.query(`UPDATE guilds SET r6opsurl = '' WHERE guild = '${guild.id}'`, (err, res) => {
            if (!err)
                Embeds.default(chan, 'Successfully set operators list to default.')
        })
        return
    }

    if (!args[1] || !args[1].startsWith('http')) {
        Embeds.error(chan, 'Please enter a valid url to a raw JSON file with the operators list!', 'ARGUMENT ERROR')
        return 
    }

    let url = args[1]

    if (!ALLOWED_HOSTS.find(u => url.startsWith(u))) {
        Embeds.error(
            chan, 
            'The entered URL is not allowed!\n\nAllowed Hosts:\n```' + ALLOWED_HOSTS.join('\n') + '```', 
            'ARGUMENT ERROR'
        )
        return
    }

    DL.get(url, (err, res) => {
        if (err) {
            Embeds.error(
                chan, 
                `The web request from the URL \`${url}\` threw follwoing error:\n\`\`\`${err}\`\`\``,
                'REQUEST ERROR'
            )
        }
        else {
            try {
                var data = JSON.parse(res)
                Mysql.query(`UPDATE guilds SET r6opsurl = '${url}' WHERE guild = '${guild.id}'`, (err, res) => {
                    if (!err && res) {
                        if (res.affectedRows == 0) {
                            MySql.query(`INSERT INTO guilds (guild, r6opsurl) VALUES('${guild.id}', '${url}')`)
                        }
                        Embeds.default(chan, `Successfully set Operators list from URL \`${url}\``)
                    }
                })
            }
            catch (e) {
                Embeds.error(
                    chan, 
                    `The content from the URL \`${url}\` could not be parsed successfully:\n\`\`\`${err}\`\`\``,
                    'JSON PARSING ERROR'
                )
            }
        }
    })

}

function set_opslist(guildid, cb) {
    Mysql.query(`SELECT * FROM guilds WHERE guild = '${guildid}'`, (err, res) => {
        if (err || !res || res.length < 1) {
            OPS = DEF_OPS
            cb()
            return
        }
        if (res[0].r6opsurl.length < 1) {
            OPS = DEF_OPS
            cb()
            return
        }
        console.log('test1')
        DL.get(res[0].r6opsurl, (err, res) => {
            if (err) {
                cb()
                console.log(err)
                return
            }
            try {
                console.log('test2')
                var data = JSON.parse(res)
                OPS.ATT = data.attackers
                OPS.DEF = data.defenders
            }
            catch (e) {
                OPS = DEF_OPS
                console.log(e)
            }
            cb()
        })
    })
}

function swap(msg) {
    let memb = msg.member
    let guild = memb.guild
    let chan = msg.channel

    Mysql.query(`SELECT * FROM r6swaps WHERE member = '${memb.id}'`, (err, res) => {
        if (err || !res)
            return
        if (res.length > 0) {
            if (Date.now() < res[0].time + SWAP_COOLDOWN) {
                Embeds.error(chan, `You can only swap again after \`${get_time(res[0].time + SWAP_COOLDOWN - Date.now())}\``)
                return
            }
        }

        if (!swaps[guild.id]) {
            swaps[guild.id] = {
                memb,
                timer: setTimeout(() => {
                    swaps[guild.id] = null
                    Embeds.error(chan, 'Swap expired.')
                }, SWAP_EXPIRE)
            }
            Embeds.default(chan, 'Another member needs to enter swap in the next 60 seconds.')
        }
        else if (swaps[guild.id].memb) {

            if (swaps[guild.id].memb.id == memb.id) {
                Embeds.error(chan, `You can not swap with yourself, <@${memb.id}>.`)
                return
            }

            Mysql.query(`UPDATE r6swaps SET time = ${Date.now()} WHERE member = '${swaps[guild.id].memb.id}'`, (err, res) => {
                if (!err && res) {
                    if (res.affectedRows == 0)
                        Mysql.query(`INSERT INTO r6swaps (guild, member, time) VALUES ('${guild.id}', '${swaps[guild.id].memb.id}', ${Date.now()})`)
                }
            })
            Mysql.query(`UPDATE r6swaps SET time = ${Date.now()} WHERE member = '${memb.id}'`, (err, res) => {
                if (!err && res) {
                    if (res.affectedRows == 0)
                        Mysql.query(`INSERT INTO r6swaps (guild, member, time) VALUES ('${guild.id}', '${memb.id}', ${Date.now()})`)
                    clearTimeout(swaps[guild.id].timer)
                    Embeds.default(chan, `Successfully swapped operators between <@${swaps[guild.id].memb.id}> and <@${memb.id}>`)
                    swaps[guild.id] = null
                }
            })
        }
    })
}

exports.ex = (msg, args) => { 

    set_opslist(msg.member.guild.id, () => {

        if (args.length < 1) {
            getOps(!last, msg, args)
            return
        }
    
        switch (args[0]) {
    
            case 'd':
            case 'def':
            case 'defenders':
                getOps(true, msg, args)
                break
    
            case 'a':
            case 'att':
            case 'attackers':
                getOps(false, msg, args)
                break
    
            case 'r':
            case 're':
            case 'reroll':
                reroll(msg, args)
                break
    
            case 'l':
            case 'list':
            case 'rerolls':
                get_rerolls(msg)
                break
    
            case 'help':
            case 'h':
                print_help(msg)
                break
    
            case 'rules':
            case 'guide':
                print_rules(msg)
                break
                
            case 'setops':
                set_ops(msg, args)
                break

            case 'listops':
                Embeds.default(
                    msg.channel,
                    '**Defenders:**\n```' + OPS.DEF.join(', ') + '```\n\n**Attackers:**\n```' + OPS.ATT.join(', ') + '```',
                    'OPERATORS LIST'
                )
                break
    
            default:
                print_help(msg)
        }

    })
}
