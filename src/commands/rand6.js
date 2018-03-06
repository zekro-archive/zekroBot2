const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')


const OPS = {
    ATT: ['Dokkaebi', 'Zofia', 'Ying', 'Blitz', 'IQ', 'Twitch', 'Montagne', 'Ash', 'Thermite', 'Sledge', 'Thatcher', 'Capitao', 'Jackal', 'Hibana', 'Blackbeard', 'Glaz', 'Fuze', 'Buck', 'Recruit', 'Recruit (Full Engage)', 'Recruit (Only Real)'],
    DEF: ['Vigil', 'Ella', 'Lesion', 'Jäger', 'Bandit', 'Rook', 'Doc', 'Pulse', 'Castle', 'Tachanka', 'Kapkan', 'Frost', 'Smoke', 'Mute', 'Caveira', 'Echo', 'Valkyrie', 'Mira', 'Recruit', 'Recruit', 'Recruit(Full Engage)']
}

const REROLL_COOLDOWN = 12 * 3600 * 1000 // 12 hours

var last = false
var ops = []

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

    if (!vc) {
        Embeds.error(chan, 'You need to be in a voice channel to perform this command!', 'ERROR')
        return
    }

    last = defenders

    ops = defenders ? shuffle(OPS.DEF) : shuffle(OPS.ATT)

    let rands = {}

    let ind = 0
    vc.members.forEach(m => {
        rands[m.displayName] = ops[ind++]
    })

    chan.send('', new Discord.RichEmbed()
        .setColor(defenders ? 0xBD4E06 : 0x0568BD)
        .setTitle(defenders ? 'DEFENDERS' : 'ATTACKERS')
        .setDescription(Object.keys(rands).map(m => {
            return `**${m}** - \`${rands[m]}\``
        }).join('\n'))
    )
}

function reroll(msg, args) {
    let chan = msg.channel
    let memb = msg.member
    if (args.length > 1) {
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
            console.log(Date.now())
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
                    console.log(r)
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
        '`r help` - Display this help message'
    )
}

function print_rules(msg) {
    Embeds.default(msg.channel, 
        'Click [**here** *(GitHub)*](https://github.com/zekroTJA/docs/blob/master/etc/random6siege_rules.md) to read rules.',
        'Random6Siege Rules'
    )
}


exports.ex = (msg, args) => { 

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

        default:
            print_help(msg)
    }

}
