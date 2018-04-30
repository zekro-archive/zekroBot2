const { client, mysql } = require('../main')
const { RichEmbed } = require('discord.js')
const Embeds = require('../util/embeds')
const { COLORS } = require('../util/statics')
const ArgParser = require('../util/argumentParser')


const JOIN_EMOJI = '\✋'

var running = {}

class Lobby {

    constructor(chan, author, cont, max, title, expire) {
        this.chan = chan
        this.author = author
        this.cont = cont
        this.max = max ? max : null
        this.title = title
        this.expire = expire ? expire : null

        this.participants = []

        return new Promise(resolve => {
            var emb = new RichEmbed()
                .setColor(COLORS.indigo)
                .setDescription(
                    cont + '\n\n' +
                    `\`0${max ? (' / ' + max) : ''} participants\``)
                .setAuthor(author.displayName, author.user.avatarURL)
            if (title)
                emb.setTitle(title)
            
            chan.send('', emb).then(m => {
                m.react(JOIN_EMOJI).then(() => 
                    resolve(this))
                this.msg = m
            })
        }) 
    }

    editMsg() {
        var emb = new RichEmbed()
            .setColor(COLORS.indigo)
            .setDescription(
                this.cont + '\n\n' +
                `\`${this.participants.length}${this.max ? (' / ' + this.max) : ''} participants\`\n\n` +
                '```\n' + this.participants.map(p => p.tag).join('\n') + '```')
            .setAuthor(this.author.displayName, this.author.user.avatarURL)
        if (this.title)
            emb.setTitle(this.title)

        this.msg.edit('', emb)
    }

    reacted(user) {
        if (this.participants.find(u => u.id == user.id))
            this.participants.splice(this.participants.indexOf(user))
        else {
            if (this.participants.length == this.max) {
                Embeds.error(this.chan, 'Sorry, this lobby is full.').then(m =>
                    m.delete(5000))
                return
            }
            this.participants.push(user)
        }
        this.editMsg()
    }
}



client.on('messageReactionAdd', (reaction, user) => {
    var target = Object.keys(running).find(k => running[k] && running[k].msg.id == reaction.message.id)
    if (user.id != client.user.id  && reaction.emoji.name == JOIN_EMOJI && target) 
    {
        running[target].reacted(user)
    }
})

client.on('messageReactionRemove', (reaction, user) => {
    var target = Object.keys(running).find(k => running[k] && running[k].msg.id == reaction.message.id)
    if (user.id != client.user.id  && reaction.emoji.name == JOIN_EMOJI && target) 
    {
        running[target].reacted(user)
    }
})


exports.ex = (msg, args) => {

    var chan = msg.channel
    var memb = msg.member

    if (!args[0]) {
        Embeds.invalidInput(chan, 'lobby')
        return
    }

    if (args[0] == 'close') {
        if (running[memb.id]) {
            delete running[memb.id]
            Embeds.default(chan, 'Lobby closed.')
        }
        else
            Embeds.error(chan, 'You have not created any lobby.')
                .then(m => m.delete(5000))

        msg.delete()
        return
    }

    var ap = new ArgParser(['max', 'title', 'expire'])
    var parsed = ap.parse(args.join(' '))

    var title = parsed.vals.title
    var max = parseInt(parsed.vals.max)
    var expire = parseInt(parsed.vals.expire)
    var cont = parsed.rest.trim()

    if (running[memb.id]) {
        Embeds.error(chan, 'You have just created a lobby.\n\
                           \rPlease close it with `zb:lobby close`.')
            .then(m => m.delete(10000))
    }
    else {
        new Lobby(chan, memb, cont, max, title, expire).then(l => 
            running[memb.id] = l)
    }
    
    msg.delete()
}