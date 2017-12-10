Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


exports.ex = (msg, args) ->

    Embeds.default msg.channel,
                   """
                   zekroBot v2 - v.#{Main.VERSION}
                   *This bot is currently in a verry early development phase and not accessable for deployment.*

                   © zekro Development (Ringo Hoffmann)
                   """,
                   'zekroBot Info'