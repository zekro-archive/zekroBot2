const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


function getLinks(guild, cb) {
    Mysql.query(`SELECT * FROM linkflag WHERE guild = '${guild.id}'`, (err, res) => {
        var links = {}
        if (!err && res)
            res.forEach(r => links[r.pattern] = r.status)
        cb(links)
    })
}


exports.ex = (msg, args) => {

    var chan = msg.channel
    var guild = msg.member.guild

    getLinks(guild, links => {

        if (!args[0]) {
            Embeds.default(chan, '```' + Object.keys(links).map(l => {
                return `${links[l] == 0 ? '[ FORBIDDEN ]' : '[  ALLOWED  ]'} ${l}`
            }).join('\n') + '```', 'LINK FLAGS')
            return
        }

        if (args[0]) {
            if (!args[1]) {
                Embeds.invalidInput(chan, 'linkflag')
                return
            }
            let link = args[0]
            let mode = args[1]
            if (['wl', 'white', 'w', 'whitelist'].includes(mode.toLowerCase()))
                mode = '1'
            else if (['bl', 'black', 'b', 'blacklist'].includes(mode.toLowerCase()))
                mode = '0'
            else if (['r', 'rem', 'remove'].includes(mode.toLowerCase()))
                mode = '-'
            if (mode == '0' || mode == '1') {
                Mysql.query(`UPDATE linkflag SET status = ${mode} WHERE pattern = '${link}' AND guild = '${guild.id}'`, (err, res) => {
                    if (!err && res) {
                        if (res.affectedRows == 0)
                            Mysql.query(`INSERT INTO linkflag (guild, pattern, status) VALUES ('${guild.id}', '${link}', ${mode})`)
                        Embeds.default(chan, `Set status of link \`${link}\` to \`${mode == 0 ? 'FORBIDDEN' : 'ALLOWED'}\``)
                        return
                    }
                })
            }
            else if (mode == '-') {
                Mysql.query(`DELETE FROM linkflag WHERE guild = '${guild.id}' AND pattern = '${link}'`, (err, res) => {
                    if (!err && res) {
                        Embeds.default(chan, `Removed \`${link}\` from link flags.`)
                        return
                    }
                })
            }
            else {
                Mysql.query(`UPDATE linkflag SET pattern = '${mode}' WHERE pattern = '${link}' AND guild = '${guild.id}'`, (err, res) => {
                    if (!err && res) {
                        if (res.affectedRows == 0)
                            Embeds.error(chan, `Could not find pattern \`${mode}\` in flag list to replace.`)
                        else
                            Embeds.default(chan, `Updated link flags.`)
                        return
                    }
                })
            }
        }

    })

}