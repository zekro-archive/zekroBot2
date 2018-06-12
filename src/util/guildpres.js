const Main = require('../main')
const client = Main.client


exports.get = (cb) => {
    Main.mysql.query("SELECT * FROM guilds", (err, res) => {
        var out = {}
        if (!err && res) {
            res.forEach(r => {
                if (r.prefix.length > 0)
                    out[r.guild] = r.prefix
            })
        }
        cb(out)
    })
}

exports.getGuild = (guild, cb) => {
    exports.get(pres => {
        if (guild.id in pres)
            cb(pres[guild.id])
        else
            cb(null)
    })
}