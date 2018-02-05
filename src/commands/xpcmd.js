const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Xp = require('../core/xp')


exports.ex = (msg, args) => {

    let chan = msg.channel

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

    switch (args[0]) {
        
    }

}