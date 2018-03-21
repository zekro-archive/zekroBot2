Discord = require 'discord.js'
Statics = require './statics'


exports.error = (chan, cont, title) ->
    msg = null
    emb = new Discord.RichEmbed()
        .setDescription cont
        .setColor Statics.COLORS.error
    if title
        emb.setTitle title
    return chan.send '', emb


exports.default = (chan, cont, title, color) ->
    msg = null
    emb = new Discord.RichEmbed()
        .setDescription cont
        .setColor if color then color else Statics.COLORS.main
    if title
        emb.setTitle title
    return chan.send '', emb

exports.invalidInput = (chan, cmd) ->
    exports.error chan, "Please enter `help #{cmd}` to get information how to use this command.", "INVALID INPUT"