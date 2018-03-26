Main = require '../main'
client = Main.client
Mysql = Main.mysql
DL = require '../util/dl'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'


CATS_ENDPOINT = 'https://aws.random.cat/meow'
BETA_ENDPOINT = 'https://zekro.de/api/cats/get/'
IMAGE_URL = 'https://zekro.de/src/catswebhookimage.jpg'
SPAM_TIMEOUT = 10 * 1000 # 10 seconds


spams = {}

# just for developing state to collect which members got warned using this command
warned = []

# Get if the current guild setting refers to zekro API or cats API
# @param guild: guild command was executed on
# @param cb: callback with true (zekro API) or false (cats API)
use_beta = (guild, cb) ->
    Mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
        if !err && res
            if res[0]
                cb(if res[0].betacatapi == 0 then false else true)
            else
                cb(false)
        else
            cb(false)

# Set guild setting if zekro API or cats API should be used on specific guild
# @param guild: guild command was executed on
# @param chan: channel, just to have the point to return an answer message
swap_api = (guild, chan) ->
    Mysql.query "UPDATE guilds SET betacatapi = (betacatapi ^ 1) WHERE guild = '#{guild.id}'", (err, res) ->
        if !err && res
            if res.affectedRows == 0
                Mysql.query "INSERT INTO guilds (guild, betacatapi) VALUES ('#{guild.id}', 1)"
                Embeds.default chan, "You are now using the API `#{BETA_ENDPOINT}`.\n\nRe-enter this command to swap back to the other API."
            else
                use_beta guild, (beta) ->
                    Embeds.default chan, "You are now using the API `#{if beta then BETA_ENDPOINT else CATS_ENDPOINT}`.\n\nRe-enter this command to swap back to the other API."

# Get or create teh ats webhook of the current channel
# @param chan: Channel in which command was executed in
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

# Sending a single cat picture into a channel until guild count of
# 100 was reached or timer got executed from outside.
# This function ist just to keep the code out of the timer
# creation below.
# @param hook: Webhook to send picture with
# @param guild: guild to get timer and count from spams
send_cat = (hook, guild) ->
    if spams[guild.id].counter > 100
        clearInterval spams[guild.id].timer
        return
    use_beta guild, (beta) ->
        DL.get (if beta then BETA_ENDPOINT else CATS_ENDPOINT), (err, res) ->
            if !err && res
                try
                    url = JSON.parse(res).file
                    hook.send {
                        files: [ url ]
                    }
                    spams[guild.id].counter += 1
                catch e
                    clearInterval spams[guild.id].timer
                    spams[guild.id] = null
                    console.log e
    


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    memb = msg.member

    # Stopping cat spam by clearing interval
    if args[0] == 'stop'
        if spams[guild.id]
            clearInterval spams[guild.id].timer
            spams[guild.id] = null
            Embeds.default chan, 'Ended cat spam.'

    # Swap between zekro API and cats API
    else if args[0] == 'beta'
        swap_api guild, chan

    # initiate cat spam into channel
    else if args[0] == 'spam'
        if memb.id in warned
            get_hook chan
                .then (hook) ->
                    spams[guild.id] = { 
                            timer: setInterval send_cat, SPAM_TIMEOUT, hook, guild
                        counter: 0
                    }
        else
            Embeds.default chan, 'This function of this command is not finished currently. Usage on own risk!\nEnter the command again to execute it.', 
                                 'WARNING', Statics.COLORS.deep_orange
            warned.push memb.id

    # Else, just send a cat puicture into the channel over the webhook
    # Because the process of requesting data and uplaoding the picture to discord
    # (this needs to be done because I dont send teh url of the picture but the image data).
    # So first send a place holder message to notify picture is requesting and then delete this
    # message after sending the picture to the chat in a new message.
    else
        get_hook chan
            .then (hook) ->
                hook.send '', new Discord.RichEmbed().setDescription('Requesting cat...').setColor(Statics.COLORS.green)
                    .then (m) ->
                        chan.fetchMessage(m.id).then (m) -> 
                            use_beta guild, (beta) ->
                                DL.get (if beta then BETA_ENDPOINT else CATS_ENDPOINT), (err, res) ->
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
                                                .setDescription("Failed accessing API of random.cat.\nBecause the API of this website is verry unreliable, I'm currently on to create an own cats API." + 
                                                                "\n\nIf you want to test my API instead of random.cat, just enter the command `zb:cat beta` to swap APIs.")
                                            )
                                    else
                                        console.log err