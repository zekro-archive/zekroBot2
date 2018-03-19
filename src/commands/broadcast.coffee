Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'


exports.ex = (msg, args) ->
    chan = msg.channel

    if args.length < 2
        Embeds.invalidInput chan, 'broadcast'
        return

    cont = args[1..].join ' '

    emb = new Discord.RichEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor(Statics.COLORS.main)
        .setDescription(cont)
        .setFooter('This is a broadcast message send by the bots host.')

    sendto = 0
    failed = 0
    switch args[0]
    
        when 'owner', 'owners', 'o'
            client.guilds.array().forEach (g, i) ->
                g.owner.createDM().then (dm) ->
                    dm.send '', emb
                    if client.guilds.array().length == i + 1
                        Embeds.default chan, "Successfully send message to **#{client.guilds.array().length}** owners."

        when 'all', 'members', 'membs'
            membs = []
            client.guilds.forEach (g) ->
                g.members.forEach (m) ->
                    if membs.map((_m) -> _m.id).indexOf(m.id) == -1 and !m.user.bot
                        membs.push m

            membs.forEach (m) ->
                m.createDM().then (dm) ->
                    dm.send '', emb
            Embeds.default chan, "Successfully send message to **#{membs.length}** members."