const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const { EventEmitter } = require('events')


var autochans = {}
var tempchans = []


exports.event = new EventEmitter();

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

client.on('voiceStateUpdate', (mold, mnew) => {
    let vold = mold.voiceChannel
    let vnew = mnew.voiceChannel

    if (vold != vnew) {
        if (vnew && vnew.id in autochans)
            createTempChan(vnew, c => {
                mnew.setVoiceChannel(c)
            })
        if (vold && tempchans.indexOf(vold.id) > -1 && vold.members.array().length == 0) {
            deleteTempChan(vold)
        }
    }
})

function createTempChan(vc, cb) {
    if (!cb)
        cb = (c) => {}
    vc.clone(`[TMP] ${vc.name}`, true).then(c => {
        c.setParent(vc.parent).then(c1 => {
            c.setPosition(vc.position + 1)
        }).catch(e => {
            c.setPosition(vc.position + 1)
        })
        tempchans.push(c.id)
        exports.event.emit('created', c)
        cb(c)
    })
}

function deleteTempChan(vc, cb) {
    if (!cb)
        cb = () => {}
    vc.delete().then(() => {
        tempchans = tempchans.filter(cid => cid != vc.id)
        cb()
    })
}