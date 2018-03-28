const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')
const Time = require('../util/timeutil')


exports.ex = (msg, args) => {
    let chan = msg.channel
    let memb = msg.member
    let guild = memb.guild

    if (args.length < 1) {
        Embeds.invalidInput(chan, 'report')
        return
    }

    let inp
    let victim

    switch (args[0]) {

        case 'list': 
        case 'show':
        case 'user':
        case 'info':
            if (!args[1])
                Embeds.error(chan, 'Please enter a member mention, ID or name to list reports of this member.')
                return
            inp = args[1].replace(/(<@!)|(<@)|>/g, '')
            victim = guild.members.find(m => m.id == inp)
            if (!victim)
                victim = guild.members.find(m => m.displayName.toLowerCase().indexOf(inp.toLowerCase()) > -1)
            if (!victim)
                Embeds.error(chan, `Can not parse any member to the identifier: \`\`\`${inp}\`\`\` `)
            else {
                Mysql.query(`SELECT * FROM reports WHERE victim = '${victim.id}'`, (err, res) => {
                    if (!err && res)
                        if (res.length > 0) {
                            let reports = res.map(r => {
                                let executor = guild.members.find(m => m.id == r.executor)
                                return '```\n' +
                                       `Date:     ${r.time}\n` +
                                       `Executor: ${executor ? executor.user.tag : r.executor}\n\n` +
                                       `Reason:\n${r.reason}\n` +
                                       '```\n'
                            }).join('\n')
                            Embeds.default(chan, reports, `Reports on record for ${victim.displayName}`)
                        }
                        else {
                            Embeds.default(chan, 'This user has a white west! :ok_hand:', `Reports on record for ${victim.displayName}`)
                        }
                })
            }
            break

        default:
            inp = args[0].replace(/(<@!)|(<@)|>/g, '')
            victim = guild.members.find(m => m.id == inp)
            let reason = args.slice(1).join(' ')
            if (!victim)
                Embeds.error(chan, `Can not parse any member to the id: \`\`\`${inp}\`\`\` `)
            else if (!reason || reason.toLowerCase() == 'test')
                Embeds.error(chan, 'Please enter a valid reason for your report!')
            else {
                Mysql.query(`INSERT INTO reports (guild, victim, executor, reason, time) VALUES` + 
                            `('${guild.id}', '${victim.id}', '${memb.id}', '${reason}', '${Time.getTime()}')`, (err, res) => {
                    if (!err && res)
                        Mysql.query(`SELECT * FROM reports WHERE victim = '${victim.id}'`, (err, res) => {
                            if (!err && res) {
                                Embeds.default(chan, 
                                    `<@${victim.id}> got reported by <@${memb.id}> with the reason \`\`\`${reason}\`\`\`\n` +
                                    `This is report number **${res.length}** for this user.`, 'Report'
                                )
                                victim.createDM().then(c => {
                                    Embeds.default(c,
                                        `You got reported by <@${memb.id}> with the reason \`\`\`${reason}\`\`\`\n` +
                                        `This is report number **${res.length}** for you.`, 'Report'
                                    )
                                })
                            }
                        })
                })
            }
            break
    }

}