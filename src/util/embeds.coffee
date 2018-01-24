Discord = require 'discord.js'
Statics = require './statics'


exports.error = (chan, cont, title) ->
    msg = null
    emb = new Discord.RichEmbed()
        .setDescription cont
        .setColor Statics.COLORS.error
    if title
        emb.setTitle title
    chan.send '', emb
        .then (m) -> msg = m
    return msg


exports.default = (chan, cont, title) ->
    msg = null
    emb = new Discord.RichEmbed()
        .setDescription cont
        .setColor Statics.COLORS.main
    if title
        emb.setTitle title
    chan.send '', emb
        .then (m) -> msg = m
    return msg

exports.invalidInput = (chan, cmd) ->
    exports.error chan, "Please enter `help #{cmd}` to get information how to use this command.", "INVALID INPUT"