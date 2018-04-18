Main = require '../main'
client = Main.client
Mysql = Main.mysql
DL = require '../util/dl'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'


BETA_ENDPOINT = 'https://zekro.de/api/lewd/get/'
IMAGE_URL = 'https://zekro.de/src/catswebhookimage.jpg'
HOOK_NAME = 'LEWDwig'


spams = {}

warned = []


get_hook = (chan) ->
    return new Promise (resolve, reject) ->
        chan.fetchWebhooks()
            .then (hooks) ->
                cat_hook = hooks.find((h) -> h.name == HOOK_NAME)
                if cat_hook
                    resolve cat_hook
                else
                    chan.createWebhook HOOK_NAME, IMAGE_URL
                        .then (hook) -> 
                            resolve(hook)
                        .catch (err) ->
                            reject err
            .catch (err) ->
                reject err



exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    memb = msg.member

    if !chan.nsfw
        Embeds.error chan, 'This command is only allowed in NSFW-Channels!'
        return

    get_hook chan
        .then (hook) ->
            hook.send '', new Discord.RichEmbed().setDescription('Getting lewd...').setColor(Statics.COLORS.green)
                .then (m) ->
                    chan.fetchMessage(m.id).then (m) -> 
                        DL.get (BETA_ENDPOINT), (err, res) ->
                            if !err && res
                                try
                                    url = JSON.parse(res).file
                                    hook.send {
                                        files: [ url ]
                                    }
                                        .then () ->
                                            m.delete()
                                catch e
                                    chan.send('', new Discord.RichEmbed()
                                        .setColor(Statics.COLORS.error)
                                        .setDescription("Failed accessing API. Please try again later.")
                                    )
                            else
                                console.log err
                        msg.delete()