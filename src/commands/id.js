const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const util = require('util')
const Statics = require('../util/statics')


exports.ex = (msg, args) => {

    let chan = msg.channel
    let guild = msg.member.guild

    let cats = {
        channels: guild.channels,
        roles: guild.roles,
        members: guild.members,
        emojis: guild.emojis
    }

    

    if (args.length < 1) {
        Embeds.invalidInput(chan, 'id')
        return
    }

    if (parseInt(args[0]) > 10000000) {
        for (var k in cats) {
            var res = cats[k].find(o => o.id == args[0])
            if (res) {
                chan.send('', new Discord.RichEmbed()
                    .setColor(Statics.COLORS.main)
                    .setTitle('Found for ID: ' + args[0])
                    .setDescription(`**${res.name ? res.name : res.displayName}** *(instance of \`${res.constructor.name}\`)*`)
                )
                return
            }
        }
        Embeds.error(chan, `Can not fetch any object with the id: \`\`\`${args[0]}\`\`\``)
    }
    else {

        let filter = (o) => (o.name ? o.name : o.displayName).toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1

        function _chantype(channel) {
            if (channel.type == 'text') 
                return `<#${channel.id}>`
            return channel.name
        }

        let chans = cats.channels.filter(filter).map(o => `${_chantype(o)}  -  \`${o.id}\``).join('\n')
        let roles = cats.roles.filter(filter).map(o => `<@&${o.id}>  -  \`${o.id}\``).join('\n')
        let membs = cats.members.filter(filter).map(o => `<@${o.id}>  -  \`${o.id}\``).join('\n')
        let emojis = cats.emojis.filter(filter).map(o => `<:${o.name}:${o.id}>  -  \`${o.id}\``).join('\n')

        let emb = new Discord.RichEmbed()
            .setColor(Statics.COLORS.main)
            .setTitle('Found objects')
        
        if (chans)
            emb.addField('Channels', chans)
        if (roles)
            emb.addField('Roles', roles)
        if (membs)
            emb.addField('Memebrs', membs)
        if (emojis)
            emb.addField('Emojis', emojis)

        if (!(chans || roles || membs || emojis))
            Embeds.error(chan, 'Can not fetch any onjects to the input: ```' + args.join(' ') + '```')
        else
            chan.send('', emb)
    }

}