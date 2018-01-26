Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'


clear = (channel, ammount, user) ->
    channel.fetchMessages()
        .then (msgs) ->
            if user
                msgs = msgs.filter (m) -> m.member.id == user.id
            msgs.array()[0..ammount].forEach (m) ->
                m.delete()


exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.member.guild

    if args.length == 0
        clear chan, 1
    else if args.length >= 1
        ammount = parseInt args[0]
        if 0 < ammount < 301
            if args.length > 1
                memb = guild.members.find (m) -> m.id == args[1..].join(' ').replace(/[<@!>]/g, '')
                if not memb
                    memb = guild.members.find (m) -> m.displayName.toLowerCase().indexOf(args[1..].join(' ').toLowerCase()) > -1
                if not memb
                    Embeds.error chan, "Can not fetch any members to the input ```#{args[1..].join(' ')}```", "INVALID INPUT"
                    return
            clear chan, ammount, memb
        else
            Embeds.error chan, "Please neter a valid number of messages.\n*Currently, max. 300 messages can be cleared at once.*", "INVALID INPUT"
            return