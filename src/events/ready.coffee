Main = require '../main' 
Logger = require '../util/logger'

client = Main.client

client.on 'ready', ->
    Logger.info """
                Successfully logged in as #{client.user.username}##{client.user.discriminator} (#{client.user.id})
                Invite link: https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=2146958455
                -------------------------
                Running on #{client.guilds.array().length} servers.
                """
    console.log "\n\n"
    client.user.setGame """#{Main.VERSION} | zb:help"""