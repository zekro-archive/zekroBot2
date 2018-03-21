const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')

const DL = require('../util/dl')


exports.ex = (msg, args) => {
    Embeds.default(msg.channel, 'TEST', null, Statics.COLORS.green)
}