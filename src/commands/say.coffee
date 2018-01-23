Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'


colors =
    red:    0xe50202
    green:  0x51e502
    cyan:   0x02e5dd
    blue:   0x025de5
    violet: 0x9502e5
    pink:   0xe502b4
    gold:   0xe5da02
    orange: 0xe54602


exports.ex = (msg, args) ->
    if args.length > 0
        if args.indexOf('colors') > -1
            Embeds.default msg.channel, "Available colors: ```#{Object.keys(colors).join(', ')}```"
            return
        argstr = ""
        argstr += arg + " " for arg in args
        if argstr.toLowerCase().indexOf("-e") > -1 and argstr.toLowerCase().indexOf("-e") < 1
            color = colors.gold
            if argstr.toLowerCase().indexOf("-e:") > -1
                clrstr = argstr.toLowerCase().split("-e:")[1].split(" ")[0]
                if clrstr of colors
                    color = colors[clrstr]
                argstr = argstr.split("-e:#{clrstr} ")[1]
            else
                argstr = argstr.split("-e ")[1]
            emb = new Discord.RichEmbed()
                .setDescription argstr
                .setColor color
            msg.channel.send '', emb
        else
            msg.channel.send argstr
    else
        colors = ""
        colors += "'#{c}', " for c of Statics.COLORS.main
        Embeds.error msg.channel, "Please enter `help say` to get information how to use this command.", "INVALID INPUT"
    msg.delete()