const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


exports.ex = (msg, args) => { 

    var chan = msg.channel
    var memb = msg.member
    var guild = msg.member.guild

    if (!args[0]) {
        Embeds.error(chan, 'Please enter a message to submit.', 'INVALID ARGUMENT')
        return
    }

    let message = args.join(' ')

    Mysql.query(
        'INSERT INTO suggestion (userid, tag, guildid, guildname, message) VALUES ' +
        `('${memb.id}', '${memb.user.tag}', '${guild.id}', '${guild.name}', '${message}')`,
        (err, res) => {
            if (err || !res)
                Embeds.error(chan, 'An error occured while submitting suggestion.', 'DATABASE ERROR')
            else
                Embeds.default(chan, `Thanks for your suggestion, <@${memb.id}>`)
        }
    )

}