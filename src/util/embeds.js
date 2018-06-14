var Discord = require('discord.js')
var Statics = require('./statics')

module.exports = {

    error(chan, cont, title) {
        var emb = new Discord.RichEmbed()
            .setDescription(cont)
            .setColor(Statics.COLORS.error)
        if (title)
            emb.setTitle(title)
        return chan.send('', emb)
    },

    default(chan, cont, title, color) {
        var emb = new Discord.RichEmbed()
            .setDescription(cont)
            .setColor(color ? color : Statics.COLORS.main)
        if (title)
            emb.setTitle(title)
        return chan.send('', emb)
    },

    invalidInput(chan, cmd) {
        this.error(chan, `Please enter \`help ${cmd}\` to get information how to use this command.`, "INVALID INPUT")
    }

}