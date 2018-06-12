Main = require '../main'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'
Guildpres = require '../util/guildpres'

client = Main.client

client.on "message", (msg) ->
    if msg.content.startsWith "<@#{Main.client.user.id}>" || msg.content.startsWith "<@!#{Main.client.user.id}>"
        Guildpres.getGuild msg.member.guild, (res) ->
            pre = Main.config.prefix
            emb = new Discord.RichEmbed()
                .setColor Statics.COLORS.cyan
                .setDescription "Hey! I am <@#{client.user.id}>! :wave:\n\nYou can use the `#{pre}help` command to get information about core commands"
                .addField 'Global Prefix', "```#{pre}```"
            if res
                emb.addField 'Prefix on this guild', "```#{res}```"
            emb.addField 'Documentation', ':link:  [**GitHub Wiki**](https://github.com/zekroTJA/zekroBot2/wiki)'
            msg.channel.send '', emb
