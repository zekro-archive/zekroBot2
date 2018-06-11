const { client, mysql, config, cmd } = require('../main')
const { RichEmbed } = require('discord.js')
const { COLORS } = require('../util/statics')
const Embeds = require('../util/embeds')
const https = require('https')

const SET_ALLOW_LEVEL = 3

const EMOJIS = {
    ACCEPT: '\✅',
    REMOVE: '\❌',
    HELP: '\❓',
    IGNORE: '\🔽'
}

var lmsgs = {}
var flaggedmsgs = []

function getLinks(guild, cb) {
    mysql.query(`SELECT * FROM linkflag WHERE guild = '${guild.id}'`, (err, res) => {
        var links = {}
        if (!err && res)
            res.forEach(r => links[r.pattern] = r.status)
        cb(links)
    })
}

function checkIfLink(url, cb) {
    let req = https.get('https://' + url, res => {
        var data = ''
        res.on('data', d => data += d.toString('utf8'))
        res.on('end', () => { 
            cb(data)
        })
    }).on('error', e => console.log)
    req.end()
}

function handler(msg) {
    var chan = msg.channel
    var memb = msg.member
    if (!memb)
        return
    var guild = memb.guild

    if (chan.type != 'text' || memb.id == client.user.id)
        return

    // var matched_links = msg.content.match(/(https?:\/\/)?(www\.)?\w{1,}\.\w{1,4}(?=(.?)(\/|$))/gm)

    // Match all possible links
    var matched_links = msg.content.match(/(https?:\/\/)?(www\.)?((\w)+\.)+([a-zA-Z]{2,}(?!\())(:\d+)?(\/\S+)?(?!\w)/gm)
    
    if (matched_links) {

        getLinks(guild, rule => {
            
            var index
            // match only 'blog.zekro.de' from for example 'http://blog.zekro.de/hl4release'
            var suspect = matched_links[0].match(/((\w)+\.)+([a-zA-Z]{2,}(?!\())(?=(\/|\W|$))/gm)[0]
            var result = Object.keys(rule).map(r => {
                // Create regex from link with replacing '*' with /.*/ and escaping other regex characters
                return new RegExp(r.replace(/\*/gm, '.*')
                                   .replace(/[\.\/\?\$]/gm, '\\$&'))
            }).find((r, i) => {
                index = i
                return suspect.match(r) != null
            })

            if (result) {
                if (rule[Object.keys(rule)[index]] == 0) {
                    msg.delete()
                    Embeds.error(chan, 'This link is not allowed on this guild!')
                        .then(m => m.delete(6000))
                } 
            }
            else {
                checkIfLink(suspect, data => {
                    console.log(flaggedmsgs, msg.id)
                    if (flaggedmsgs.includes(msg.id))
                        return
                    chan.send('', new RichEmbed()
                        .setColor(COLORS.deep_orange)
                        .setDescription('Unregistered Link detected: ```' + suspect + '```')
                    ).then(m => {
                        lmsgs[m.id] = { originmsg: msg, link: suspect }
                        if (flaggedmsgs.length > 10)
                            flaggedmsgs = []
                        flaggedmsgs.push(msg.id)
                        m.react(EMOJIS.ACCEPT).then(() => {
                            m.react(EMOJIS.REMOVE).then(() => {
                                m.react(EMOJIS.IGNORE).then(() => {
                                    m.react(EMOJIS.HELP)
                                })
                            })
                        })
                    })
                })
            }

        }) 

    }

    // if (matched_links) {
        // getLinks(guild, links => {
            // var matched_link = matched_links[0]
                // .replace(/(https?:\/\/)|www\./g, '')
            // let found_link = Object.keys(links).find(k => matched_link.indexOf(k) > -1)
            // if (found_link) {
                // if (links[found_link] == 0) {
                    // msg.delete()
                    // Embeds.error(chan, 'This link is not allowed on this guild!')
                        // .then(m => m.delete(6000))
                // } 
            // }
            // else {
                // chan.send('', new RichEmbed()
                    // .setColor(COLORS.deep_orange)
                    // .setDescription('Unregistered Link detected: ```' + matched_link + '```')
                // ).then(m => {
                    // lmsgs[m.id] = { originmsg: msg, link: matched_link }
                    // m.react(EMOJIS.ACCEPT).then(() => {
                        // m.react(EMOJIS.REMOVE).then(() => {
                            // m.react(EMOJIS.IGNORE).then(() => {
                                // m.react(EMOJIS.HELP)
                            // })
                        // })
                    // })
                // })
            // }
        // })
    // }
}

client.on('message', msg => handler(msg))
client.on('messageUpdate', (omsg, nmsg) => handler(nmsg))


client.on('messageReactionAdd', (reaction, user) => {
    if (user.id == client.user.id || !Object.keys(lmsgs).includes(reaction.message.id))
        return
    
    var msg = reaction.message
    var member = msg.guild.members.find(m => m.id == user.id)
    if (!member)
        return
    if (cmd.getPermLvl(member) >= SET_ALLOW_LEVEL) {
        switch (reaction.emoji.name) {
            case EMOJIS.ACCEPT:
                mysql.query(`INSERT INTO linkflag (guild, pattern, status) VALUES ('${member.guild.id}', '${lmsgs[msg.id].link}', '${1}')`, (err, res) => {
                    if (!err && res) {
                        msg.delete()
                    }
                })
                break

            case EMOJIS.REMOVE:
                mysql.query(`INSERT INTO linkflag (guild, pattern, status) VALUES ('${member.guild.id}', '${lmsgs[msg.id].link}', '${0}')`, (err, res) => {
                    if (!err && res) {
                        lmsgs[msg.id].originmsg.delete()
                        msg.delete()
                    }
                })
                break

            case EMOJIS.IGNORE:
                msg.delete()
                break

            case EMOJIS.HELP:
                Embeds.default(msg.channel, `${EMOJIS.ACCEPT}  Accept link - will not ask again later\n\
                                            \r${EMOJIS.REMOVE}  Blacklist link - removes message an all messages including this url will be removed\n\
                                            \r${EMOJIS.IGNORE}  Ignore this time - link will be flaged next time again`
                ).then(m => m.delete(10000))
                break
            
            default:
                reaction.remove(user)
        }
    }
})