Main = require '../main' 
Logger = require '../util/logger'
client = Main.client
Mysql = Main.mysql
Statics = require '../util/statics'
Embeds = require '../util/embeds'

client.on 'guildMemberAdd', (memb) ->
    if !memb.user.bot
        guild = memb.guild
        Mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.length > 0

                    # AUTOROLE
                    role = guild.roles.find (r) -> r.id == res[0].autorole
                    if role
                        memb.addRole role, "AUTOROLE ON MEMBER JOIN"
                    else if res[0].autorole != ""
                        guild.owner.createDM().then (dm) ->
                            Embeds.error dm, "Set role for autorole is not existent anymore!\nFix this with the command `autorole <role>` or disable autorole with `autorole off`.", "AUTOROLE ERROR"

                    # JOINMSG
                    msgchan = guild.channels.find (c) -> c.id == res[0].notifychan
                    if msgchan
                        message = res[0].joinmsg
                        if message and message != ''
                            Embeds.default msgchan, message.replace(/\[g\]/gm, guild.name).replace(/\[m\]/gm, "<@#{memb.id}>"), null, Statics.COLORS.green