const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')


exports.ex = (msg, args) => {
    console.log(msg.content.replace(/\n/gm, '--nl--'))
}