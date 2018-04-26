const Main = require('../main')
const Msgs = require('../events/msgCounter')
const Embeds = require('../util/embeds')
const { getTime } = require('../util/timeutil')


exports.ex = (msg, args) => {

    function _uptime() {
        let t = (Date.now() - Main.startupTime) / 1000
        let d = Math.floor(t / (24 * 3600))
        let h = Math.floor(t % (24 * 3600) / 3600)
        let m = Math.floor(t % (24 * 3600) % 3600 / 60)
        let s = Math.floor(t % (24 * 3600) % 3600 % 60)
        return `${d} days, ${h} hours, ${m} mins, ${s} secs`
    }
    Embeds.default(
        msg.channel, 
        '```\n' +
        `Uptime:                  ${_uptime()}\n` +
        `Last restart:            ${getTime(new Date(Main.startupTime))}\n\n` +
        `Some counts since last restart:\n` +
        `Commands executed:       ${Main.cmd.cmdsExecuted}\n` +
        `Messages analysed:       ${Msgs.msgs}\n` +
        `MySql Queries executed:  ${Main.mysql.executedQueries}\n` +
        `People annoyed:          ${Math.floor(Math.random() * 10000000)}\n` +
        '```',
        'Uptime and stats since last restart'
    )

}