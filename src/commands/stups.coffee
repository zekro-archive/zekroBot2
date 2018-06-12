Main = require '../main'
Mysql = Main.mysql
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'
Funcs = require '../util/funcs'


exports.ex = (msg, args) ->
    chan = msg.channel
    memb = msg.member
    guild = memb.guild
    
    _error = (err) ->
        Embeds.error chan, "Failed sending nudge: ```#{err}```", 'EXECUTION ERROR'

    if args.length < 2
        Embeds.invalidInput chan, 'stups'
        return

    # receiver = guild.members.find (m) -> m.id == args[0].replace /(<@)|>/gm, ''
    # if !receiver
    #     receiver = guild.members.find (m) -> m.displayName.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
    receiver = Funcs.fetchMember guild, args[0]
    if !receiver
        Embeds.error chan, "Can not fetch any members to the entered identifier: ```#{args[0]}```", 'INVALID INPUT'
    else
        emb = new Discord.RichEmbed()
            .setColor Statics.COLORS.main
            .setAuthor "Nudge from #{memb.displayName}", memb.user.avatarURL
            .setDescription ":love_letter:  #{args[1..].join(' ')}"
            .setFooter guild.name
            .setTimestamp new Date()
        receiver.createDM()
            .then (c) ->
                c.send '', emb
                    .then ->
                        Embeds.default chan, "Send nudge to <@#{receiver.id}>."
                        msg.delete()
                    .catch (e) ->
                        _error e
            .catch (e) ->
                _error e