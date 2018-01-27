Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'
fs = require 'fs'


client.on 'ready', ->
    if fs.existsSync 'RESTARTED'
        fs.readFile 'RESTARTED', 'utf8', (err, res) ->
            guildid = res.split('|')[0]
            chanid = res.split('|')[1]
            msgid = res.split('|')[2]
            client.guilds.find (g) -> g.id == guildid
                .channels.find (c) -> c.id == chanid
                    .fetchMessage msgid
                        .then (msg) ->
                            fs.unlink 'RESTARTED'
                            msg.edit '', new Discord.RichEmbed().setDescription('Restart finished! :ok_hand:').setColor(Statics.COLORS.green)


exports.ex = (msg, args) ->
    msg.channel.send '', new Discord.RichEmbed().setDescription('Restarting... :wave:').setColor(Statics.COLORS.orange)
        .then (m) ->
            fs.writeFileSync('RESTARTED', "#{m.member.guild.id}|#{m.channel.id}|#{m.id}")
            process.exit()