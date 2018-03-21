Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'
Logger = require '../util/logger'


get_blacklist = (cb) ->
    Main.mysql.query "SELECT * FROM membsets WHERE bcignore = 0", (err, res) ->
        if !err && res
            cb res.map((r) -> r.id)
        else
            cb null

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
        .setFooter('This is a broadcast message send by the bots host.\n\nYou can disable broadcast messages by entering \'disbale\' here.')

    sendto = 0
    failed = 0
    switch args[0]
    
        when 'test'
            msg.member.createDM().then (dm) ->
                dm.send '', emb

        when 'owner', 'owners', 'o'
            client.guilds.array().forEach (g, i) ->
                g.owner.createDM().then (dm) ->
                    dm.send '', emb
                    if client.guilds.array().length == i + 1
                        Embeds.default chan, "Successfully send message to **#{client.guilds.array().length}** owners."

        when 'all', 'members', 'membs'
            get_blacklist (bl) ->
                if !bl
                    Embeds.error chan, 'An error occured while requesting blacklist. Process canceled.'
                    return
                membs = []
                client.guilds.forEach (g) ->
                    g.members.forEach (m) ->
                        if membs.map((_m) -> _m.id).indexOf(m.id) == -1 and !m.user.bot
                            if !(bl.find((_e) -> _e == m.id))
                                membs.push m

                membs.forEach (m) ->
                    m.createDM().then (dm) ->
                        dm.send '', emb
                        Logger.info "[SEND BC] #{m.user.tag}"
                Embeds.default chan, "Sending message to **#{membs.length}** members."