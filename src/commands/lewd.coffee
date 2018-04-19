Main = require '../main'
client = Main.client
Mysql = Main.mysql
DL = require '../util/dl'
Embeds = require '../util/embeds'
Discord = require 'discord.js'
Statics = require '../util/statics'


BETA_ENDPOINT = 'https://zekro.de/api/lewd/get/'
IMAGE_URL = 'https://zekro.de/src/lewdwebhookimage.jpg'
HOOK_NAME = 'LEWDwig'


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

    Mysql.query "SELECT disable_lewd FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
        if err || !res
            Embeds.error chan, "An error occured requesting settings from database:\n```#{err}```"
            return

        if ['disable', 'enable', 'block'].includes (if args[0] then args[0].toLowerCase() else null)
            if Main.cmd.getPermLvl(memb) < 4
                Embeds.error chan, 'You are not permitted to perform this command.'
            else
                Mysql.query "UPDATE guilds SET disable_lewd = #{res[0].disable_lewd ^ 1} WHERE guild = '#{guild.id}'", (err, _res) ->
                    if err || !res
                        Embeds.error chan, "An error occured requesting settings from database:\n```#{err}```"
                    else
                        Embeds.default chan, "#{if res[0].disable_lewd == 1 then 'Enabled' else 'Disabled'} lewd command on this guild.\nYou can enable or disable this command with `zb:lewd enable`."
            return

        if res[0].disable_lewd
            Embeds.error chan, 'This command disabled on this guild!'
            return

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