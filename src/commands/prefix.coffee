Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->
    if args.length < 1
        Embeds.error chan, "Please use `help prefix` to get information about this command!", "INVALID INPUT"
        return

    