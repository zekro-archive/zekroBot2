const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


client.on('message', (msg) => {
    let chan = msg.channel
    if (chan.type == 'dm' && msg.author != client.user) {
        let user = msg.author
        let cont = msg.content

        switch (cont.toLowerCase()) {
            case 'disable':
                switch_notify(user, chan, false)
                break
            case 'enable':
                switch_notify(user, chan, true)
                break
        }
    }
})





function switch_notify(user, chan, enable) {
    let e = enable ? 1 : 0
    Mysql.query(`UPDATE membsets SET bcignore = ${e} WHERE id = '${user.id}'`, (err, res) => {
        if (!err && res) {
            if (res.affectedRows == 0) {
                Mysql.query(`INSERT INTO membsets (bcignore, id) VALUES (${e}, '${user.id}')`)
            }
            if (enable)
                Embeds.default(chan, '**Enabled** broadcast messages.\nYou can disable it with entering `disable` here.')
            else
                Embeds.default(chan, '**Disabled** broadcast messages.\nYou can enable it with entering `enable` here.')
        }
    })
}