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
    let owner = guild.owner

    emb = new  Discord.RichEmbed()
        .setTitle(guild.name + ' - Guild Info')
        .setColor(guild.owner.highestRole.color)
        .addField('ID', `\`\`\`${guild.id}\`\`\``)
        .addField('Owner', `<@!${owner.id}> - ${owner.tag} *(${owner.id})*`)
        .addField(
            'Members',
            '```\n' +
            `Total Members:   ${membs.array().length}  (${membs.filter(m => m.presence.status != 'offline').array().length} online)` +
            `Real Members:    ${membs.filter(m => !m.user.bot).array().length}  (${membs.filter(m => !m.user.bot && m.presence.status != 'offline').array().length} online)` +
            `Bots:            ${membs.filter(m => m.user.bot).array().length}  (${membs.filter(m => m.user.bot && m.presence.status != 'offline').array().length} online)` +
            '```\n'
        )

    if (guild.iconURL)
        emb.setThumbnail(guild.iconURL)

    msg.channel.send('', emb)
}