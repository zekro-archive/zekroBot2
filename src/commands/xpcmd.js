const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Xp = require('../core/xp')


exports.ex = (msg, args) => {

    let chan = msg.channel
    let guild = msg.member.guild

    function _lvlbar(lvlproc) {
        let have = '####################'.substr(0, parseInt(20 * lvlproc))
        let need = '                    '.substr(0, parseInt(20 * (1 - lvlproc)))
        return `[${have}${need}]\n`
    }

    function _getXpMsg(member, cb) {
        Xp.getParsedUserLvl(msg.member, (res) => {
            if (!res) {
                Embeds.error(chan, 'Could not access data from DB')
                return
            }
            let lvlproc = res.next / 100
            let xpstr = '```\n' +
                        `LVL ${res.lvl} (${res.xp} XP total)\n` +
                        `${res.next} % to next lvl\n` +
                        _lvlbar(lvlproc) +
                        '```'
            cb(xpstr)
        }, true)
    }

    if (args.length < 1) {
        _getXpMsg(msg.member, xpstr => {
            Embeds.default(chan, xpstr, 'Your current XP Status')
        })
    }
    else {

        if (args[0].toLowerCase() == 'list') {
            Xp.getGuildXp(guild, (res) => {
                let list = Object.keys(res)
                    .sort((a, b) => res[b] - res[a])
                    .slice(0, 20)
                    .map((k, i) => `**${i + 1}** - ${k} - \`${res[k]} XP (LVL ${Xp.getLvlFromXp(res[k])})\``)
                    .join('\n')
                Embeds.default(chan, list, 'Top 20 XP of this guilds members')
            })
            return
        }

        let member = guild.members.find(m => m.id == args[0].replace(/(<@)|>/g, ''))
        if (!member)
            member = guild.members.find(m => m.displayName.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1)
        if (!member) {
            Embeds.error(chan, 'Can not fetch any member to the identifier: ```' + args.join(' ') + '```')
            return
        }
        _getXpMsg(member, xpstr => {
            Embeds.default(chan, xpstr, `Current XP status of ${member.displayName}`)
        })
    }
}