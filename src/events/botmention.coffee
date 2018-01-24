Main = require '../main'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'
Guildpres = require '../util/guildpres'

client = Main.client

client.on "message", (msg) ->
    if msg.mentions.members
        if (msg.mentions.members.find (m) -> m.id == client.user.id)
            Guildpres.getGuild msg.member.guild, (res) ->
                pre = Main.config.prefix
                emb = new Discord.RichEmbed()
                    .setColor Statics.COLORS.cyan
                    .setDescription "Hey! I am <@#{client.user.id}>! :wave:\n\nYou can use the `#{pre}help` command to get information about core commands"
                    .addField 'Global Prefix', "```#{pre}```"
                if res
                    emb.addField 'Prefix on this guild', "```#{res}```"
                emb.addField 'Documentation', 'Soon...'
                msg.channel.send '', emb
