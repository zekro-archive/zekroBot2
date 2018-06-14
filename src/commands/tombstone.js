const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')


const ENDPOINT = 'http://www.tombstonebuilder.com/generate.php'

exports.ex = (msg, args) => {

    var chan = msg.channel

    if (args.length < 1) {
        Embeds.invalidInput(chan, 'tombstone')
        return
    }

    var lines = args
        .join(" ")
        .split("\n")
        .map(s => s.replace(/\s/gm, '%20'))

    var assambledlink = (() => {
        var out = ENDPOINT + '?top1=' + lines[0]
        lines.slice(1).forEach((s, i) => out += `&top${i + 2}=${s}`)
        return out
    })()

    chan.send('', new Discord.Attachment(assambledlink, 'ts.jpg'))

}