Main = require '../main' 
Logger = require '../util/logger'
client = Main.client
Settings = require '../core/settings'
Embeds = require('../util/embeds')

client.on 'guildMemberAdd', (memb) ->
    if !memb.user.bot
        guild = memb.guild
        Main.mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.length > 0
                    role = guild.roles.find (r) -> r.id == res[0].autorole
                    if role
                        memb.addRole role, "AUTOROLE ON MEMBER JOIN"
                    else
                        guild.owner.createDM().then (dm) ->
                            Embeds.error dm, "Set role for autorole is not existent anymore!\nFix this with the command `autorole <role>` or disable autorole with `autorole off`.", "AUTOROLE ERROR"