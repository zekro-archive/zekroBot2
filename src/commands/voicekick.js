const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')


exports.ex = (msg, args) => {

    var chan = msg.channel
    var memb = msg.member
    var guild = msg.member.guild

    if (!args[0]) {
        Embeds.invalidInput(chan, 'vkick')
        return
    }

    var victim = guild.members.find(m => m.id == args[0].replace(/(<@!)|(<@)|>/g, ''))
    if (!victim)
        victim = guild.members.find(m => m.displayName.toLowerCase().indexOf(args[0].toLowerCase()) > -1)
    if (!victim) {
        Embeds.error(chan, 'Can not fetch any member by the given argument: ```' + args[0] + '```')
        return
    }
    if (!victim.voiceChannel) {
        Embeds.error(chan, `The specified member (<@${victim.id}>) is currently not in a voice channel.`)
        return
    }

    guild.createChannel('54267527825752725', 'voice').then(c => {
        victim.setVoiceChannel(c).then(() => {
            c.delete()
            Embeds.default(chan, `:boot:  Kicked <@${victim.id}> out of the voice channel.`)
        })
    })

}