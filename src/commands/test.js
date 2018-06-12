const { client, mysql } = require('../main')
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')
const Funcs = require('../util/funcs')


exports.ex = (msg, args) => {

    Embeds.default(msg.channel, `${args[0]} => ${Funcs.fetchMember(msg.member.guild, args[0], true)}`)

    // var chan = msg.channel
    // var memb = msg.member
    // var guild = memb.guild

    // var muteRole = guild.roles.find(r => r.name == 'zekroBot_muted')

    // if (!args[0]) {
    //     var muted = 'Noone muted on this guild'
    //     if (muteRole) {
    //         let tmp = guild.members
    //             .filter(m => m.roles.find(r => r.id == muteRole.id) != null)
    //         if (tmp && tmp.length > 0)
    //             muted = tmp.map(m => `${m.displayName} (${m.user.tag})`).join('\n')
    //     }
    //     Embeds.default(chan, '```' + muted + '```', 'Muted members on this guild')
    //     return
    // }

    // var victim = guild.members.find(m => 
    //     m.id == args[0] ||
    //     m.id == args[0].replace(/[<@!>]/g, '') ||
    //     m.displayName.toLowerCase() == args[0].toLowerCase() ||
    //     m.displayName.toLowerCase().startsWith(args[0].toLowerCase()) ||
    //     m.displayName.toLowerCase().indexOf(args[0].toLowerCase()) > -1
    // )

    // if (!victim) {
    //     Embeds.error(chan, 'Could not fetch any member to the given query ```' + args[0] + '```')
    //     return
    // }

    // if (!muteRole) {
    //     guild.createRole({
    //         name: 'zekroBot_muted',
    //         permissions: [
                
    //         ]
    //     })
    // }
}