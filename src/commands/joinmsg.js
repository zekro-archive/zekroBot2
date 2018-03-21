const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


exports.ex = (msg, args) => {

    var chan = msg.channel
    var guild = msg.member.guild

    if (!args[0]) {
        Embeds.invalidInput(chan, 'joinmsg')
        return
    }

    var content = args.join(' ').replace(/\|[a-z]*\|/gm, (s) => {
        return `:${s.substring(1, s.length - 1)}:`
    }) 

    Mysql.query(`UPDATE guilds SET joinmsg = '${content}' WHERE guild = '${guild.id}'`, (err, res) => {
        if (err || !res)
            return
        if (res.affectedRows == 0) {
            Mysql.query(`INSERT INTO guilds (guild, joinmsg) VALUES ('${guild.id}', '${content}')`)
        }
        Embeds.default(chan, 'Successfully set join message.\n\n' + 
                             '**ATTENTION**\nIf you are using emoticons in the message, please enter them in the command with `|` instead of `:`.\n' +
                             'You can also use `[g]` as replacer for the guild name and `[m]` for the members name.\n\nHere you can see an example:\n' +
                             '```zb:joinmsg Hey and welcome to [g], [m]! |wave|```')
    })

    Mysql.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, (err, res) => {
        console.log(res[0].notifychan)
        if (err || !res)
            return
        if (res.length == 0 || !res[0].notifychan || res[0].notifychan == '')
            Embeds.error(chan, '**ATENTION:**\n\nNotification channel is not set! If this channel is not set, there will not join message appear!\n' +
                               'Set the notification channel for this guild with the command ```zb:msgchan (<name/ID>)``` *This requires permission level 4.*')
    })

}