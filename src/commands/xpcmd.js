const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Xp = require('../core/xp')


exports.ex = (msg, args) => {

    let chan = msg.channel
    let guild = msg.member.guild

    if (args.length < 1) {

        Xp.getParsedUserLvl(msg.member, (res) => {
            if (!res) {
                Embeds.error(chan, 'Could not access data from DB')
                return
            }
            let lvlproc = res.next / 100
            console.log(lvlproc, 20 * lvlproc)
            function _lvlbar() {
                let have = '####################'.substr(0, parseInt(20 * lvlproc))
                let need = '                    '.substr(0, parseInt(20 * (1 - lvlproc)))
                return `[${have}${need}]\n`
            }
            let xpstr = '```\n' +
                        `LVL ${res.lvl} (${res.xp} XP total)\n` +
                        `${res.next} % to next lvl\n` +
                        _lvlbar() +
                        '```'
            Embeds.default(chan, xpstr, 'Your current XP Status')
        }, true)
    }
    else {

        if (args[0] == 'list') {
            Xp.getGuildXp(guild, (out) => {
                var sortedKeys = Object.keys(out)
                    .sort((a, b) => {
                        return out[b] - out[a];
                    })
                    .slice(0, 20)
                var msgtext = sortedKeys
                    .map((k, i) => {
                        let xp = out[k]
                        let lvl = Xp.getLvlFromXp(xp)
                        return `\`${++i < 10 ? '0' + i : i}\` - ${k} - **Lvl ${lvl}** *(${xp} xp)*`
                    })
                    .join('\n')
                Embeds.default(chan, msgtext, 'Top 20 by XP on guild')
            })
            return
        }

        let member = guild.members.find(m => m.id == args[0].replace(/(<@!)|(<@)|>/g))
        if (!member)
            member = guild.members.find(m => m.displayName.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1)
        if (!member) {
            Embeds.error(chan, 'Can not fetch any member to the identifier: ```' + args.join(' ') + '```')
            return
        }
    }

}