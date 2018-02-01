Main = require '../main'
Mysql = Main.mysql
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    if args.length < 1
        Embeds.invalidInput chan, 'cmdlogchan'
        return
    cmdlogchan = guild.channels.filter (c) -> c.type == 'text'
        .find (c) -> c.id == args[0].replace(/(<#)|>/g, '')
    if !cmdlogchan
        cmdlogchan = guild.channels.filter (c) -> c.type == 'text'
            .find (c) -> c.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
    if !cmdlogchan
        Embeds.error chan, "Can not fetch any channel to the input ```#{args.join(' ')}```"
    else
        require('../events/cmdlog').reset guild
        Mysql.query "UPDATE guilds SET cmdlogchan = '#{cmdlogchan.id}' WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.affectedRows == 0
                    Mysql.query "INSERT INTO guilds (guild, cmdlogchan) VALUES ('#{guild.id}', '#{cmdlogchan.id}')"
                Embeds.default chan, "Set channel <##{cmdlogchan.id}> as command log channel."
            else
                Embeds.error chan, "An error occured while writing data to database: ```#{err}```"