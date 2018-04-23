const { client, mysql, config, cmd } = require('../main')
const { RichEmbed } = require('discord.js')
const { COLORS } = require('../util/statics')
const Embeds = require('../util/embeds')

const SET_ALLOW_LEVEL = 3

const EMOJIS = {
    ACCEPT: '\✅',
    REMOVE: '\❌',
    HELP: '\❓',
    IGNORE: '\🔽'
}

var lmsgs = {}

function getLinks(guild, cb) {
    mysql.query(`SELECT * FROM linkflag WHERE guild = '${guild.id}'`, (err, res) => {
        var links = {}
        if (!err && res)
            res.forEach(r => links[r.pattern] = r.status)
        cb(links)
    })
}

client.on('message', msg => {

    var chan = msg.channel
    var memb = msg.member
    if (!memb)
        return
    var guild = memb.guild

    if (chan.type != 'text' || memb.id == client.user.id)
        return

    var matched_links = msg.content.match(/(https?:\/\/)?(www\.)?\w{1,}\.\w{1,4}(?=(.?)(\/|$))/gm)
    
    if (matched_links) {
        getLinks(guild, links => {
            let found_link = Object.keys(links).find(k => matched_links[0].indexOf(k) > -1)
            if (found_link) {
                if (links[found_link] == 0) {
                    msg.delete()
                    Embeds.error(chan, 'This link is not allowed on this guild!')
                        .then(m => m.delete(6000))
                } 
            }
            else {
                chan.send('', new RichEmbed()
                    .setColor(COLORS.deep_orange)
                    .setDescription('Unregistered Link detected: ```' + matched_links[0] + '```')
                ).then(m => {
                    lmsgs[m.id] = { originmsg: msg, link: matched_links[0] }
                    m.react(EMOJIS.ACCEPT).then(() => {
                        m.react(EMOJIS.REMOVE).then(() => {
                            m.react(EMOJIS.IGNORE).then(() => {
                                m.react(EMOJIS.HELP)
                            })
                        })
                    })
                })
            }
        })
    }
})


client.on('messageReactionAdd', (reaction, user) => {
    if (user.id == client.user.id || Object.keys(lmsgs).includes(reaction.message))
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
                        lmsgs[msg.id].originmsg.delete()
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
        }
    }

    reaction.remove(user)
})