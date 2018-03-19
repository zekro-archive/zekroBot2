const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')

const DL = require('../util/dl')


exports.ex = (msg, args) => {
    DL.get('https://pastebin.com/raw/x9x1nu9h', (err) => {
        console.log(err)
    })
}