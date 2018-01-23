const Main = require('../main')
const client = Main.client


exports.get = (cb) => {
    Main.mysql.query("SELECT * FROM guilds", (err, res) => {
        if (!err && res) {
            out = {}
            res.forEach(r => {
                if (r.prefix.length > 0)
                    out[r.guild] = r.prefix
            })
            cb(out)
        }
    })
}