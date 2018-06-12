const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')
const Funcs = require('../util/funcs')


exports.ex = (msg, args) => {
    var chan = msg.channel
    var memb = msg.member
    var guild = memb.guild

    if (args.length < 1) {
        Embeds.invalidInput(chan, "private")
        return
    }

    if (args[0] && args[0].toLowerCase() == "close") {
        if (!chan.name.startsWith('tmp-privatetalk-'))
            Embeds.error(chan, 'This channel is no private talk channel.')
        else if (chan.topic != parseInt(memb.id) << 5)
            Embeds.error(chan, 'You are not the creator of this private talk.')
        else
            chan.delete()
        return
    }

    var members = []
    args.forEach(a => {
        let m = Funcs.fetchMember(guild, a)
        if (m)
            members.push(m)
    })

    if (members.length < 1) {
        Embeds.error(chan, `Not enough members to create a private talk channel.`)
        return
    }

    guild.createChannel(
        `tmp-privatetalk-${Math.floor(Math.random() * (898) + 101)}`,
        'text'
    ).then(c => {
        c.overwritePermissions(memb.roles.first(), {
            VIEW_CHANNEL: false,
            READ_MESSAGE_HISTORY: false
        })
        c.overwritePermissions(guild.me, {
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
        })
        members.forEach(m => {
            c.overwritePermissions(m, {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: false
            })
        })
        c.setTopic(parseInt(memb.id) << 5)
        c.send(
            `Private Talk Channel created.\n\nInvited Members: <@${memb.id}>, ${members.map(m => `<@${m.id}>`).join(', ')}\n\n` +
            `Enter \`zb:private close\` in this channel to close private talk.`
        )
    })
}