Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    msg.channel.send('test').then (msg) ->
        msgString = JSON.stringify msg
        recMsg = JSON.parse msgString
        recMsg.edit 'Edited from JSON object, yay! :D'