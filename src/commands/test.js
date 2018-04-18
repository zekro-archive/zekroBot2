const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')

const DL = require('../util/dl')
const UrbDict = require('../util/urbdictapi')


exports.ex = (msg, args) => {

    var ud = new UrbDict()
    ud.getDefinition('kek', 999).then(console.log).catch(console.log)

}