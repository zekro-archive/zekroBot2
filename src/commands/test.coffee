Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->

    console.log 'TEST EXECUTED'
    # Main.mysql.setData 'testing', 'content', 'test2', 'user', 'deinemudda', (err) ->
    #     console.log err
    Main.mysql.existsData 'testing', args[0], args[1], (res, reason) ->
        Embeds.default msg.channel, """```#{res} (#{reason})```"""