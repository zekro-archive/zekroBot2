const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const util = require('util')
const Statics = require('../util/statics')


const emojis = '\u0031\u20E3 \u0032\u20E3 \u0033\u20E3 \u0034\u20E3 \u0035\u20E3 \u0036\u20E3 \u0037\u20E3 \u0038\u20E3 \u0039\u20E3 \u0030\u20E3'.split(' ')
var polls = {}

exports.load = () => Poll.load()


class Poll {

    constructor(memb, chan, topic, poss, ans) {
        this.memb = memb
        this.topic = topic
        this.poss = poss
        this.ans = ans ? ans : {}

        chan.send('', this.emb).then(m => {
            this.poss.forEach((p, i) => setTimeout(() => m.react(emojis[i]), 500 * i))
            this.msg = m
            this.save()
        })

        client.on('messageReactionAdd', (reaction, user) => {
            let msg = reaction.message
            if (user.id != client.user.id && msg.id == this.msg.id) {
                let emoji = reaction.emoji.name
                let vote = emojis.indexOf(emoji)
                if (vote > -1 && vote < this.poss.length) {
                    if (this.vote(user, vote))
                        this.save()
                }
                reaction.remove(user)
            }
        })
    }

    get emb() {
        return new Discord.RichEmbed()
            .setAuthor(this.memb.displayName, this.memb.user.avatarURL)
            .setDescription(this.topic)
            .addField(
                'Answers', 
                this.poss.map((p, i) => `${emojis[i]}  ${p}  \`${
                    Object.keys(this.ans).filter(u => this.ans[u] == i).length
                }\``).join('\n')
            )
            .setColor(Statics.COLORS.cyan)
    }

    close() {
        this.msg.channel.send('', this.emb)
        this.msg.channel.send('', new Discord.RichEmbed().setDescription(`Poll closed.`).setColor(Statics.COLORS.main))
        this.msg.delete()
        let tempans = this.ans
        delete polls[this.memb.id]
        this.delete()
    }

    vote(memb, numb) {
        if (memb.id in this.ans || numb >= this.poss.length || numb < 0)
            return false
        this.ans[memb.id] = numb
        this.msg.edit(this.emb)
        return true
    }

    save() {
        let saveState = {
            msg: {
                id: this.msg.id,
                channel: this.msg.channel.id,
                guild: this.msg.member.guild.id,
                member: this.msg.member.id
            },
            member: this.memb.id,
            topic: this.topic.replace(/\n/gm, '--nl--'),
            poss: this.poss.map(p => p.replace(/\n/gm, '--nl--')),
            ans: this.ans
        }
        Mysql.query(`UPDATE votes SET data = '${JSON.stringify(saveState)}' WHERE membid = '${this.memb.id}'`, (err, res) => {
            if (!err && res) {
                if (res.affectedRows == 0)
                    Mysql.query(`INSERT INTO votes (membid, data) VALUES ('${this.memb.id}', '${JSON.stringify(saveState)}')`)
            }
        })
    }

    static load() {
        return new Promise((resolve, reject) => {
            Mysql.query(`SELECT * FROM votes`, (err, res) => {
                if (!err && res) {
                    res.forEach(r => {
                        let data = JSON.parse(r.data)
                        let guild = client.guilds.find(g => g.id == data.msg.guild)
                        let chan = guild.channels.find(c => c.id == data.msg.channel)
                        let poll = new Poll(
                            guild.members.find(m => m.id == data.member),
                            chan,
                            data.topic.replace(/(--nl--)/gm, '\n'),
                            data.poss.map(p => p.replace(/(--nl--)/gm, '\n')),
                            data.ans
                        )
                        polls[r.membid] = poll

                        // Thanks @ Lee#6874 (github.com/LeeDJD) for the answer
                        chan.fetchMessages()
                            .then(messages => {
                                messages.find(m => m.id == data.msg.id).delete()
                            })
                            .catch(console.error);

                        resolve()
                    })
                }
                else
                    reject()
            })
        })
    }

    delete() {
        Mysql.query(`DELETE FROM votes WHERE membid = '${this.memb.id}'`)
    }

}


exports.ex = (msg, args) => { 

    let memb = msg.member
    let chan = msg.channel

    if (args.length < 1) {

    }
    else {
        switch (args[0]) {
            case 'close':
            case 'stop':
            case 'end':
                if (memb.id in polls)
                    polls[memb.id].close()
                else
                    Embeds.error(chan, 'You can only close a vote if you created one before.')
                break

            default:
                let cont = args.join(' ').split(/( *\| *)/gm).filter((a, i) => i % 2 == 0)
                if (!(memb.id in polls)) {
                    let poll = new Poll(memb, chan, cont[0], cont.slice(1))
                    polls[memb.id] = poll
                }
                else {
                    Embeds.error(chan, 'There is currently a poll created by you running.\nClose it with `vote close` before opening another one.')
                }
                break
        }
    }
}