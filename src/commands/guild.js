const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const util = require('util')
const Statics = require('../util/statics')


exports.ex = (msg, args) => { 

    let guild = msg.member.guild
    let membs = guild.members
    let chans = guild.channels
    let roles = guild.roles
    let owner = guild.owner

    var emb = new  Discord.RichEmbed()
        .setTitle(guild.name + ' - Guild Info')
        .setColor(guild.owner.highestRole.color)
        .addField('ID', `\`\`\`${guild.id}\`\`\``)
        .addField('Owner', `<@${owner.id}> - ${owner.user.tag} *(${owner.id})*`)
        .addField('Created At', guild.createdAt)
        .addField('Region', guild.region)
        .addField(
            'Members',
            '```\n' +
            `Total Members:   ${membs.array().length}  (${membs.filter(m => m.presence.status != 'offline').array().length} online)\n` +
            `Real Members:    ${membs.filter(m => !m.user.bot).array().length}  (${membs.filter(m => !m.user.bot && m.presence.status != 'offline').array().length} online)\n` +
            `Bots:            ${membs.filter(m => m.user.bot).array().length}  (${membs.filter(m => m.user.bot && m.presence.status != 'offline').array().length} online)\n` +
            '```\n'
        )
        .addField(
            'Channels',
            '```\n' +
            `Text Channels:    ${chans.filter(c => c.type == 'text').array().length}\n` +
            `Voice Channels:   ${chans.filter(c => c.type == 'voice').array().length}\n` +
            `Categories:       ${chans.filter(c => c.type == null).array().length}\n` +
            '                  -------\n' +
            `                  ${chans.array().length}\n` +
            '```'
        )
        .addField(
            'Roles',
            '```' +
            roles.map(r => {
                return `${r.name} (${r.members.filter(m => m.presence.status != 'offline').array().length}/${r.members.array().length})`
            }).slice(0, 80).join('\n') +
            '```' +
            (roles.array().length > 80 ? `and ${roles.array().length - 80} roles more...` : '')
        )

    if (guild.emojis.array().length)
        emb.addField('Emojis', guild.emojis.map(e => `<:${e.name}:${e.id}>`).join(' '))

    if (guild.iconURL)
        emb.setThumbnail(guild.iconURL)

    msg.channel.send('', emb)
}