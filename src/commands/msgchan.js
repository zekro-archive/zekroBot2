const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


function set_chan(guild, channel) {
    return new Promise((resolve, reject) => {
        let chanid = channel ? channel.id : ''
        Mysql.query(`UPDATE guilds SET notifychan = '${chanid}' WHERE guild = '${guild.id}'`, (err, res) => {
            if (err || !res) {
                reject(err)
                return
            }
            if (res.affectedRows == 0) {
                Mysql.query(`INSERT INTO guilds (guild, notifychan) VALUES ('${guild.id}', '${chanid}')`, (err, res) => {
                    if (err || !res) {
                        reject(err)
                        return
                    }
                })
            }
            resolve()
        })
    })
}

exports.ex = (msg, args) => {

    var chan = msg.channel
    var guild = msg.member.guild

    if (!args[0]) {
        set_chan(guild, chan).then(() => {
            Embeds.default(chan, `Set this channel (<#${chan.id}>) as notification channel.\n\nIf you want to set an other channel as notification channel, enter the channel ID or name as argument: ` + 
                                 '```zb:msgchan <name/ID>```')
        })
        return
    }

    if (args[0] == 'reset') {
        set_chan(guild, null).then(() => {
            Embeds.default(chan, 'Notification channel is now unset again.')
        })
        return
    }

    var schan = guild.channels.find(c => c.id == args[0])
    if (!schan)
        schan = guild.channels.find(c => c.name.toLowerCase().indexOf(args[0].toLowerCase()) > -1)
    if (!schan)
        Embeds.error(chan, 'The specified text channel does not exist.')
    else if (schan.type != 'text')
        Embeds.error(chan, 'Only text channels can specified as notification message channel!')
    else {
        set_chan(guild, schan).then(() => {
            Embeds.default(chan, `Set <#${schan.id}> as notification channel for this guild.`)
        })
    }
}


