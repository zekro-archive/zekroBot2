const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')
const config = Main.config
const Logger = require('../util/logger')


var xploop


function getLvlFromXp(xpamm) {
    let start = config.exp.startlvl
    let delta = config.exp.delta
    function _getreq(x) {
        return x == 0 ? 0 : start * delta ** (x - 1)
    }
    let lvl = 0
    while (xpamm > _getreq(lvl))
        lvl++
    return  lvl - 1
}

function getParsedUserLvl(member, cb, raw) {
    getMembXp(member, (res) => {
        if (!res)
            if (raw)
                cb(null)
            else
                cb('*Could not get data from DB*')
        else {
            let start = config.exp.startlvl
            let delta = config.exp.delta
            let lvl = getLvlFromXp(res)
            function _getreq(x) {
                return x == 0 ? 0 : start * delta ** (x - 1)
            }
            let nextlvl = parseInt(res - _getreq(lvl))
            let nextlvln = parseInt(_getreq(lvl + 1))
            let nextlvlp = parseInt((nextlvl / nextlvln) * 100)
            if (raw)
                cb({
                    lvl,
                    xp: res,
                    next: nextlvlp
                })
            else
                cb(
                    `**LVL \`${lvl}\`** (*\`${res}\` XP total*)\n` +
                    `\`${nextlvlp} %\` to next lvl`
                )
        }
    })
}

function changeXpVal(value, member) {
    Mysql.query(`UPDATE xp SET xp = xp + ${value} WHERE user = '${member.id}' && guild = '${member.guild.id}'`, (err, res) => {
        if (!err && res)
            if (res.affectedRows == 0)
                Mysql.query(`INSERT INTO xp (user, xp, guild) VALUES ('${member.id}', ${value}, '${member.guild.id}')`)
    })
}

function getMembXp(member, cb) {
    Mysql.query(`SELECT * FROM xp WHERE user = '${member.id}' && guild = '${member.guild.id}'`, (err, res) => {
        if (!err && res && res.length > 0)
            cb(res[0].xp)
        else
            cb(null)
    })
}

function getGuildXp(guild, cb) {
    Mysql.query(`SELECT * FROM xp WHERE guild = '${guild.id}'`, (err, res) => {
        let out = {}
        if (!err && res && res.length) {
            res.forEach(r => {
                let memb = guild.members.find(m => m.id == r.user)
                out[memb] = r.xp
            })
        }
        cb(out)
    })
}


client.on('message', msg => {
    if (msg.channel.type == 'text') {
        let memb = msg.member
        if (!memb)
            return
        let guild = memb.guild
        let cont = msg.content

        let xpamm = parseInt(Math.log((cont.length / config.exp.flatter) + config.exp.cap) * config.exp.xpmsgmultiplier)

        if (xpamm > 0)
            changeXpVal(xpamm, memb)

        /*
            IDEA:
            Maybe later here an notification message into the channel to notify user
            reached a specific level.
            → Must be disableable
        */
    }
})

client.on('ready', () => {
    xploop = setInterval(() => {
        client.guilds.forEach(g => {
            g.members
                .filter(m => m.presence.status != 'offline')
                .forEach(m => {
                    changeXpVal(config.exp.xpinterval, m)
                })
        })
    }, config.exp.interval * 60000)
    Logger.info(`XP Loop running in interval thread #${xploop}`)
})


module.exports = {
    changeXpVal,
    getMembXp,
    getGuildXp,
    getParsedUserLvl,
    getLvlFromXp
}