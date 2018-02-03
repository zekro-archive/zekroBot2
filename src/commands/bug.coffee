Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'


exports.ex = (msg, args) ->
    emb = new Discord.RichEmbed()
        .setColor Statics.COLORS.main
        .setTitle 'Bug & Suggestion Submission'
        .addField 'GitHub', """
                            If you have a GitHub, please submit your bug or suggestion as 
                            :point_right:  [**Issue**](https://github.com/zekroTJA/zekroBot2/issues/new) 
                            or as 
                            :point_right:  [**Pull Request**](https://github.com/zekroTJA/zekroBot2/pulls)
                            """
        .addField 'Other Contacts', """
                                    Discord DM:
                                    :point_right:  `zekro#9131`
                                    Discord Dev Server:
                                    :point_right:  [**Server Invite**](https://zekro.de/discord)
                                    """
    msg.channel.send '', emb