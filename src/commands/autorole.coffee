Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    if args.length < 1
        Embeds.invalidInput chan, "autorole"
        return
    if args[0] == "off" or args[0] == "disable" or args[0] == "reset"
        Main.mysql.query "UPDATE guilds SET autorole = '' WHERE guild = '#{guild.id}'"
        Embeds.default chan, "Reset autorole for this guild."
        return
    roles = guild.roles
    role = roles.find (r) -> r.id == args[0].replace(/[<@&>]/g, '')
    if not role
        role = roles.find (r) -> r.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
    if not role
        Embeds.error chan, "Could not fetch any role to the input ```#{args.join(' ')}```"
    else
        Main.mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.length > 0
                    Main.mysql.query "UPDATE guilds SET autorole = '#{role.id}' WHERE guild = '#{guild.id}'"
                else
                    Main.mysql.query "INSERT INTO guilds (guild, autorole) VALUES ('#{guild.id}', '#{role.id}')"
            Embeds.default chan, "Set role <@&#{role.id}> as autorole on this guild."