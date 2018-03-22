Main = require '../main'
Mysql = Main.mysql
client = Main.client
Embeds = require '../util/embeds'
Statics = require '../util/statics'
Time = require '../util/timeutil'


exports.ex = (msg, args) ->

    chan = msg.channel
    memb = msg.member
    guild = memb.guild

    if !args[0]
        Embeds.invalidInput chan, 'ban'
        return

    if !args[1]
        Embeds.error chan, 
                     "Please enter a valid reason for the ban, which will be displayd in the ban message in message channel and saved in the reports database.",
                     "INVALID ARGUMENTS"
        return

    reason = args[1..].join ' '

    victim = guild.members.find (m) -> m.id == args[0].replace /(<@!)|(<@)|>/g, ''
    if !victim
        Embeds.error chan, "Can not fetch any member to: ```#{args[0]}```\n**Attention:**\n\nThis command can only be used with member **mentions** or **IDs**."
    else
        victim.user.createDM().then (dm) ->
            Embeds.default dm, "You got banned by **#{memb.user.tag}** for reason: ```#{reason}```", "BAN", Statics.COLORS.orange

        victim.ban({
            reason: reason
            days: 7
        }).then ->
            Embeds.default chan, "`#{victim.user.tag}` got banned by <@#{memb.id}> for reason: ```#{reason}```", "BAN", Statics.COLORS.orange
            Mysql.query "SELECT * FROM guilds WHERE guild = '#{guild.id}'", (err, res) ->
                if !err && res
                    if res.length > 0 && res[0].notifychan && res[0].notifychan != ''
                        notifychan = guild.channels.find((c) -> c.id == res[0].notifychan)
                        if notifychan
                            mbeds.default notifychan, "`#{victim.user.tag}` got kicked by <@#{memb.id}> for reason: ```#{reason}```", "BAN", Statics.COLORS.orange

            Mysql.query "INSERT INTO reports (guild, victim, executor, reason, time) VALUES ('#{guild.id}', '#{victim.id}', '#{memb.id}', '[BAN] #{reason}', '#{Time.getTime()}')"