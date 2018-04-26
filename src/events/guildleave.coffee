Main = require '../main' 
client = Main.client
Mysql = Main.mysql
Settings = require '../core/settings'
Embeds = require('../util/embeds')
Statics = require('../util/statics')

client.on 'guildMemberRemove', (memb) ->
    if !memb.user.bot
        guild = memb.guild
        Mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
            if !err and res
                if res.length > 0

                    # LEAVEMSG
                    msgchan = guild.channels.find (c) -> c.id == res[0].notifychan
                    if msgchan
                        message = res[0].leavemsg
                        if message and message != ''
                            Embeds.default msgchan, message.replace(/\[g\]/gm, guild.name).replace(/\[m\]/gm, "<@#{memb.id}>"), null, Statics.COLORS.orange