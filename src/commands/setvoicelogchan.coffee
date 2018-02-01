Main = require '../main'
Mysql = Main.mysql
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    if args.length < 1
        Embeds.invalidInput chan, 'voicelogchan'
        return
    voicelogchan = guild.channels.filter (c) -> c.type == 'text'
        .find (c) -> c.id == args[0].replace(/(<#)|>/g, '')
    if !voicelogchan
        voicelogchan = guild.channels.filter (c) -> c.type == 'text'
            .find (c) -> c.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
    if !voicelogchan
        Embeds.error chan, "Can not fetch any channel to the input ```#{args.join(' ')}```"
    else
        require('../events/voicelog').reset guild
        Mysql.query "UPDATE guilds SET vlogchan = '#{voicelogchan.id}' WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.affectedRows == 0
                    Mysql.query "INSERT INTO guilds (guild, vlogchan) VALUES ('#{guild.id}', '#{voicelogchan.id}')"
                Embeds.default chan, "Set channel <##{voicelogchan.id}> as command log channel."
            else
                Embeds.error chan, "An error occured while writing data to database: ```#{err}```"