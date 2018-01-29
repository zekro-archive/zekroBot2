const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql


var autochans = {}


exports.set = (chan, guild) => {
    autochans[chan.id] = guild.id
}

exports.unset = (chan, guild) => {
    delete autochans[chan.id]
}

exports.get = (guild) => {
    if (guild)
        return Object.keys(autochans).filter(k => autochans[k] == guild.id)
    return Object.keys(autochans)
}


client.on('ready', () => {
    Mysql.query(`SELECT * FROM autochans`, (err, res) => {
        if (!err && res)
            res.forEach(r => autochans[r.chan] = r.guild)
    })
})