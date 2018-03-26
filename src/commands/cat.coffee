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


use_beta = (guild, cb) ->
    Mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
        if !err && res
            if res[0]
                cb(if res[0].betacatapi == 0 then false else true)
            else
                cb(false)
        else
            cb(false)

swap_api = (guild, chan) ->
    Mysql.query "UPDATE guilds SET betacatapi = (betacatapi ^ 1) WHERE guild = '#{guild.id}'", (err, res) ->
        if !err && res
            if res.affectedRows == 0
                Mysql.query "INSERT INTO guilds (guild, betacatapi) VALUES ('#{guild.id}', 1)"
                Embeds.default chan, "You are now using the API `#{BETA_ENDPOINT}`.\n\nRe-enter this command to swap back to the other API."
            else
                use_beta guild, (beta) ->
                    Embeds.default chan, "You are now using the API `#{if beta then BETA_ENDPOINT else CATS_ENDPOINT}`.\n\nRe-enter this command to swap back to the other API."

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
                spams[guild.id] = null
                console.log e
    


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild
    memb = msg.member

    if args[0] == 'stop'
        if spams[guild.id]
            clearInterval spams[guild.id].timer
            spams[guild.id] = null
            Embeds.default chan, 'Ended cat spam.'

    else if args[0] == 'beta'
        swap_api guild, chan

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

    else
        get_hook chan
            .then (hook) ->
                hook.send '', new Discord.RichEmbed().setDescription('Requesting cat...').setColor(Statics.COLORS.green)
                    .then (m) ->
                        chan.fetchMessage(m.id).then (m) -> 
                            use_beta guild, (beta) ->
                                console.log (if beta then BETA_ENDPOINT else CATS_ENDPOINT)
                                DL.get (if beta then BETA_ENDPOINT else CATS_ENDPOINT), (err, res) ->
                                    if !err && res
                                        try
                                            url = JSON.parse(res).file
                                            console.log res
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