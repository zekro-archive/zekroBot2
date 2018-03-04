const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')


const OPS = {
    ATT: ['Dokkaebi', 'Zofia', 'Ying', 'Blitz', 'IQ', 'Twitch', 'Montagne', 'Ash', 'Thermite', 'Sledge', 'Thatcher', 'Capitao', 'Jackal', 'Hibana', 'Blackbeard', 'Glaz', 'Fuze', 'Buck', 'Recruit', 'Recruit (Full Engage)', 'Recruit (Only Real)'],
    DEF: ['Vigil', 'Ella', 'Lesion', 'Jäger', 'Bandit', 'Rook', 'Doc', 'Pulse', 'Castle', 'Tachanka', 'Kapkan', 'Frost', 'Smoke', 'Mute', 'Caveira', 'Echo', 'Valkyrie', 'Mira', 'Recruit', 'Recruit', 'Recruit(Full Engage)']
}



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getOps(defenders, msg, args) {
    let vc = msg.member.voiceChannel
    let chan = msg.channel

    if (!vc) {
        Embeds.error(chan, 'You need to be in a voice channel to perform this command!', 'ERROR')
        return
    }

    let ops = defenders ? shuffle(OPS.DEF) : shuffle(OPS.ATT)

    let rands = {}

    vc.members.forEach((m, i) => {
        rands[m] = ops[i]
    })
}


exports.ex = (msg, args) => { 

    if (args.length < 1) {

        return
    }

    switch (args[0]) {

        case "d":
        case "def":
        case "defenders":
            getOps(true, msg, args)
            break
    }

}