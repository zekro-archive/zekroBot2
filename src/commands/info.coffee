Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'


exports.ex = (msg, args) ->

    deps = Main.package.dependencies
    deps_str = Object.keys deps
        .map (k) -> ":white_small_square:  [**#{k}**](https://www.npmjs.com/package/#{k}) *(#{deps[k]})*"
        .join '\n'
    client.fetchUser Main.config.hostid
        .then (host) ->
            msg.channel.send('', new Discord.RichEmbed()
                .setColor Statics.COLORS.main
                .setTitle "zekroBot V2 - Info"
                .setDescription """
                                This bot is the reworked version of the original [zekroBot](https://github.com/zekroTJA/DiscordBot).
                                Currently, this bot is in a very early development phase, so not all features of the old version are implemented yet.

                                © 2017 - 2018 zekro Development (Ringo Hoffmann)
                                """
                .addField   "Current Version", "v.#{Main.VERSION}"
                .addField   "Current Host",
                            """
                            ```
                            #{host.username}##{host.discriminator}
                            ```
                            *This user is the user registered in the bot's root config as **host**. So this user has the highest permission level and is responsible for all administration tasks for this bot.*
                            """
                .addField   "InviteLink",
                            """
                            Get this bot on your own server with the following Link:
                            :point_right:  **[INVITE](https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=#{Statics.INVPERMS})**
                            ```
                            https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=#{Statics.INVPERMS}
                            ```
                            """
                .addField   "GitHub Repository", "[**zekroTJA/zekroBot2**](https://github.com/zekroTJA/zekroBot2)"
                .addField   "Contributors", 
                            ":white_small_square:  [**zekro**](https://github.com/zekroTJA)"
                .addField   "Dependencies", deps_str
            )