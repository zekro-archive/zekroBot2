const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')


exports.ex = (msg, args) => { 

    let chan = msg.channel
    let guild = msg.guild

    if (args.length < 1) {
        Embeds.invalidInput(chan, 'quote')
        return
    }

    if (args[0].startsWith('https://discordapp.com/channels/')) {
        let split = args[0].split('/')
        args[0] = split[split.length - 1]
        console.log("REPLACED:",args[0])
    }

    function _edit(ans, quoteMsg) {
        console.log(quoteMsg.url);
        ans.edit('', new Discord.RichEmbed()
            .setColor(Statics.COLORS.cyan)
            .setAuthor(quoteMsg.member.displayName, quoteMsg.author.avatarURL, quoteMsg.url)
            .setDescription(quoteMsg.content + `\n\n[:link:](${quoteMsg.url})`)
            .setFooter('#' + quoteMsg.channel.name)
            .setTimestamp(quoteMsg.createdAt)
        )
    }

    chan.send('', new Discord.RichEmbed()
        .setDescription(':hourglass_flowing_sand:   Searching for message...')
        .setColor(Statics.COLORS.main)
    ).then(ans => {
            chan.fetchMessage(args[0]).then(quoteMsg => {
                _edit(ans, quoteMsg)
            }).catch(() => {
                guild.channels.filter(c => c.type == 'text').forEach(c => {
                    c.fetchMessage(args[0]).then(quoteMsg => {
                        _edit(ans, quoteMsg)
                        return
                    }).catch(() => {})
                })
                ans.edit('', new Discord.RichEmbed()
                    .setColor(Statics.COLORS.error)
                    .setDescription(`Unable to fetch any message with the ID \`\`\`${args[0]}\`\`\` `)
                )
            })
    })
    msg.delete()
}