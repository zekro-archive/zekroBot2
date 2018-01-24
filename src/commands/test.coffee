Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    Main.mysql.query "SELECT * FROM guilds", (err, res) ->
        console.log(res[1].prefix.length)