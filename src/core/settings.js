const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql


exports.getGame = (cb) => {
    Mysql.query(`SELECT * FROM gensets WHERE \`key\` = 'game.name' || \`key\` = 'game.type' || \`key\` = 'game.url'`, (err, res) => {
        if (!err && res) {
            var out = {}
            res.forEach(r => {
                switch (r.key) {
                    case 'game.name':
                        out.name = r.value
                        break
                    case 'game.type':
                        out.type = r.value
                        break
                    case 'game.url':
                        out.url = r.value
                        break
                }
            })
            cb(out)
        } else {
            console.log(err)
            cb(err)
        }
    })
}


exports.setGame = (sets, cb) => {
    if (!cb)
        cb = () => {}
    Object.keys(sets).forEach(k => {
        Mysql.query(`SELECT * FROM gensets WHERE \`key\` = 'game.${k}'`, (err ,res) => {
            if (!err && res)
                if (res.length > 0)
                    Mysql.query(`UPDATE gensets SET value = '${sets[k]}' WHERE \`key\` = 'game.${k}'`, cb)
                else
                    Mysql.query(`INSERT INTO gensets (\`key\`, \`value\`) VALUES ('game.${k}', '${sets[k]}')`, cb)
            else
                cb(err)
        })
    })
}


exports.getAutochanPre = (guild, cb) => {
    Mysql.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, (err, res) => {
        if (!err && res)
            console.log(res.autochanprefix, res.autochanprefix == "")
            if (res.length > 0)
                cb(res.autochanprefix == "" ? null : res.autochanprefix)
        else
            cb(null)
    })
}