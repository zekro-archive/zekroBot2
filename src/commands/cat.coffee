Main = require '../main'
client = Main.client
DL = require '../util/dl'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'


CATS_ENDPOINT = 'https://aws.random.cat/meow'
IMAGE_URL = 'https://zekro.de/src/catswebhookimage.jpg'
SPAM_TIMEOUT = 10 * 1000 # 10 seconds


spams = {}


get_hook = (chan) ->
    return new Promise (resolve, reject) ->
        chan.fetchWebhooks()
            .then (hooks) ->
                cat_hook = hooks.find((h) -> h.name == "Cats")
                if cat_hook
                    resolve cat_hook
                else
                    chan.createWebhook 'Cats', IMAGE_URL
                        .then (hook) -> 
                            resolve(hook)
                        .catch (err) ->
                            reject err
            .catch (err) ->
                reject err



send_cat = (hook, guild) ->
    if spams[guild.id].counter > 100
        clearInterval spams[guild.id].timer
        return
    DL.get CATS_ENDPOINT, (err, res) ->
        if !err && res
            try
                url = JSON.parse(res).file
                hook.send {
                    files: [ url ]
                }
                spams[guild.id].counter += 1
            catch e
                clearInterval spams[guild.id].timer
                console.log e
    


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild

    if args[0] == 'spam'
        get_hook chan
            .then (hook) ->
                spams[guild.id] = { 
                    timer: setInterval send_cat, SPAM_TIMEOUT, hook, guild
                    counter: 0
                }
    else
        get_hook chan
            .then (hook) ->
                hook.send '', new Discord.RichEmbed().setDescription('Requesting cat...').setColor(Statics.COLORS.green)
                    .then (m) ->
                        chan.fetchMessage(m.id).then (m) -> 
                            DL.get CATS_ENDPOINT, (err, res) ->
                                if !err && res
                                    try
                                        url = JSON.parse(res).file
                                        hook.send {
                                            files: [ url ]
                                        }
                                            .then () ->
                                                m.delete()
                                    catch e
                                        console.log e