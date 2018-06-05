Main = require '../main' 
Logger = require '../util/logger'
client = Main.client
Settings = require '../core/settings'
Statics = require '../util/statics'

client.on 'ready', ->
    Logger.info """
                Successfully logged in as #{client.user.username}##{client.user.discriminator} (#{client.user.id})
                Invite link: 
                https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=#{Statics.INVPERMS}
                -------------------------
                Running on #{client.guilds.array().length} servers.
                """
    console.log "\n"

    Settings.getGame (curr) ->
        if curr
            client.user.setPresence({
                game: {
                    name: (if curr.name then curr.name else "zekro.de | #{Main.config.prefix}help")
                }
                type: if curr.type then curr.type else 0
                url: if curr.url then curr.url else "http://twitch.tv/zekrotja"
            })
            # client.user.setActivity((if curr.name then curr.name else "zekro.de | #{Main.config.prefix}help"),
            #                         { 
            #                             type: if curr.type then curr.type else 0
            #                             url: if curr.url then curr.url else "http://twitch.tv/zekrotja"
            #                         }
            # )
        else
            client.user.setActivity """zekros Tutorials. | #{Main.VERSION} | zb:help""", {url: "http://twitch.tv/zekrotja", type: 3}

    Main.mysql.query "SELECT * FROM perms", (err, res) ->
        if !err and res
            res.forEach (r) ->
                Main.cmd.setPerms r.role, r.lvl

    Main.loadModLoader()

    require('../commands/vote').load()

    Logger.debug("Testing complete. Shutting down...")
    if Main.TESTING_MODE
        process.exit 0