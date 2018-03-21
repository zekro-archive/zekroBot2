const Main = require('../main')
const Logger = require('../util/logger')
const client = Main.client
const Mysql = Main.mysql
const Statics = require('../util/statics')
const Embeds = require('../util/embeds')
const { RichEmbed } = require('discord.js')
const Time = require('../util/timeutil')


var logchanid = {}

exports.reset = (guild) => {
    logchanid[guild.id] = null
}

function getlogchan(guild, cb) {
    if (!logchanid[guild.id]) {
        Mysql.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, (err, res) => {
            if (!err && res) {
                if (res.length > 0)
                    logchanid[guild.id] = res[0].vlogchan ? res[0].vlogchan : 'unset'
                else
                    logchanid[guild.id] = 'unset'
            }
            cb()
        })
    } else
        cb()
}

client.on('voiceStateUpdate', (mold, mnew) => {
    let guild = mnew.guild
    
    getlogchan(guild, () => {
        let logchan = guild.channels.find(c => c.id == logchanid[guild.id])
        if (logchan) {
            
            let vold = mold.voiceChannel
            let vnew = mnew.voiceChannel

            if (!vold && vnew) {
                logchan.send('', new RichEmbed()
                    .setColor(Statics.COLORS.green)
                    .setDescription(`:white_check_mark: **${mnew.displayName}** joined **\`${vnew.name}\`**`)
                    .setFooter(Time.getTime())
                )
            }
            else if (vold && !vnew) {
                logchan.send('', new RichEmbed()
                    .setColor(Statics.COLORS.orange)
                    .setDescription(`:small_red_triangle_down: **${mnew.displayName}** left **\`${vold.name}\`**`)
                    .setFooter(Time.getTime())
                )
            }
            else if (vold && vnew && vold.id != vnew.id) {
                logchan.send('', new RichEmbed()
                    .setColor(Statics.COLORS.cyan)
                    .setDescription(`:arrow_right: **${mnew.displayName}** went from **\`${vold.name}\`** to **\`${vnew.name}\`**`)
                    .setFooter(Time.getTime())
                )
            }
        }
    })
})