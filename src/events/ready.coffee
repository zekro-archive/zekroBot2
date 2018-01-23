Main = require '../main' 
Logger = require '../util/logger'

client = Main.client

client.on 'ready', ->
    Logger.info """
                Successfully logged in as #{client.user.username}##{client.user.discriminator} (#{client.user.id})
                Invite link: 
                https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=2146958455
                -------------------------
                Running on #{client.guilds.array().length} servers.
                """
    console.log "\n\n"
    client.user.setActivity """zekros Tutorials. | #{Main.VERSION} | zb:help""", {url: "http://twitch.tv/zekrotja", type: 3}

    Main.mysql.query "SELECT * FROM perms", (err, res) ->
        if !err and res
            res.forEach (r) ->
                Main.cmd.setPerms r.roles.split(','), parseInt r.lvl
                Logger.info "Set roles [#{r.roles}] to permlvl #{r.lvl}"