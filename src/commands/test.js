const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')


exports.ex = (msg, args) => {

    var test
    async function _get() {
        test = await Main.mysql.query(`SELECT * FROM guilds WHERE guild = '${msg.member.guild.id}'`)
    }
    _get()
    console.log(test)
}