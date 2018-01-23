Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Guildpres = require('../util/guildpres')


exports.ex = (msg, args) ->
    guild = msg.member.guild
    chan = msg.channel

    if args.length < 1
        Main.mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.length > 0
                    Embeds.default chan, "The current guild specific prefix is: ```#{res[0].prefix}```"
                else
                    Embeds.default chan, "No guild specifix prefix set."
        return

    pre = args.join(' ')
    Main.mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
        if !err and res
            if res.length > 0
                Main.mysql.query "UPDATE guilds SET prefix = '#{pre}' WHERE guild = '#{guild.id}'"
            else
                Main.mysql.query "INSERT INTO guilds (guild, prefix) VALUES ('#{guild.id}', '#{pre}')"
            Embeds.default chan, "Changed prefix for this guild to ```#{pre}```\n\nYou can still use the core prefix `#{Main.config.prefix}` instead of the guild specific prefix."
            Guildpres.get(dbpres => Main.cmd.setGuildPres(dbpres))
        else
            Embeds.error chan, "An unexpected error occured while saving to database: ```#{err}```", "UNEXPECTED ERROR"