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

    msg.channel.send('', new Discord.RichEmbed()
        .setColor Statics.COLORS.main
        .setTitle "zekroBot V2 - Info"
        .setDescription """
                        This bot is the reworked version of the original [zekroBot](https://github.com/zekroTJA/DiscordBot).
                        Currently, this bot is in a very early development phase, so not all features of the old version are implemented yet.

                        © 2017 - 2018 zekro Development (Ringo Hoffmann)
                        """
        .addField   "Current Version", "v.#{Main.VERSION}"
        .addField   "GitHub Repository", "[zekroTJA/zekroBot2](https://github.com/zekroTJA/zekroBot2)"
        .addField   "Contributors", 
                    ":white_small_square:  [zekro](https://github.com/zekroTJA)"
        .addField   "Dependencies", deps_str
    )