const Main = require('../main')
const Logger = require('../util/logger')
const client = Main.client
const Mysql = Main.mysql
const Statics = require('../util/statics')
const Embeds = require('../util/embeds')


function dbinsert(dbkey, chan, guild) {
    Mysql.query(`UPDATE guilds SET ${dbkey} = '${chan.id}' WHERE guild = '${guild.id}'`, (err, res) => {
        if (!err && res)
            if (res.affectedRows == 0)
                Mysql.query(`INSERT INTO guilds (guild, ${dbkey}) VALUES ('${guild.id}', '${chan.id}')`)
    })
}


client.on('guildCreate', g => {

    g.createChannel('zekroBot', 'category').then(c => {
        g.createChannel('commands').then(cmdchan => {
            cmdchan.setParent(c)
            Embeds.default(cmdchan,
                '**Hey!** :wave:\n\n' +
                `Im <@${client.user.id}>, a multi-functional, chat and music bot!\n\n` +
                `My default prefix is \`${Main.config.prefix}\`. If you want to set a guild specific prefix, use the command` +
                `\`\`\`${Main.config.prefix}prefix <new prefix>\`\`\`\n\n` +
                'Do you want a list of commands of this bot? Enter ```' +
                `${Main.config.prefix}help` + '```\n\n' +
                'To get some more information about this bot, just hit the command ```' +
                `${Main.config.prefix}info` + '```' +
                'More information about the bot, you can find in the [**Wiki Pages**](https://github.com/zekroTJA/zekroBot2/wiki).\n' +
                'There is also a [**Getting Started**](https://github.com/zekroTJA/zekroBot2/wiki/Getting-Started) page, where you can get information how to set up this bot on yout guild.'
            )
        })
        g.createChannel('cmdlog').then(cmdlogchan => {
            cmdlogchan.setParent(c)
            dbinsert('cmdlogchan', cmdlogchan, g)
        })
        g.createChannel('voicelog').then(vlogchan => {
            vlogchan.setParent(c)
            dbinsert('vlogchan', vlogchan, g)
        })
    })

})