const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')


exports.ex = (msg, args) => {

    var chan = msg.channel
    var memb = msg.member
    var guild = memb.guild

    if (!args[0]) {
        Embeds.invalidInput(chan, 'link')
        return
    }

    function _getChan(query) {
        return guild.channels.find(c => 
            c.id == query ||         
            c.id == query.replace(/(<#)|>/g, '') || 
            c.name.toLowerCase() == query.toLowerCase() || 
            c.name.toLowerCase().startsWith(query.toLowerCase()) || 
            c.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        )
    }

    var chan1, chan2, vchan, tchan 

    switch (args[0]) {

        case 'list':
        case 'ls':
            
            Mysql.query(`SELECT * FROM chanlinks WHERE guild = '${guild.id}'`, (err, res) => {
                if (!err && res) {
                    if (res.length == 0)
                        Embeds.default(chan, '*No channels linkedo n this guild*', 'Linked Channels on this Guild')
                    else {
                        let out = ''
                        res.forEach(r => {
                            let vc = guild.channels.find(c => c.id == r.vchan)
                            out += `:white_small_square:  <#${r.tchan}> ←→ \`${vc ? vc.name : 'deleted channel'}\`\n`
                        })
                        Embeds.default(chan, out, 'Linked Channels on this Guild')
                    }
                }
                else {
                    Embeds.error(chan, 'An error occured requesting channels from database.')
                }
            })
            break

        case 'unlink':
        case 'remove':
        case 'reset':
            chan1 = _getChan(args[1])
            chan2 = _getChan(args[2])

            if (
                (!chan1 || !chan2) ||
                (!(chan1.type == 'text' && chan2.type == 'voice' || chan1.type == 'voice' && chan2.type == 'text'))
            ) {
                Embeds.error(chan, 'Please enter a valid text and voice channel to link them together!', 'INVALID ARGUMENTS')
                return
            }

            vchan = chan1.type == 'voice' ? chan1 : chan2
            tchan = chan2.type == 'text' ? chan2 : chan1

            Mysql.query(`DELETE FROM chanlinks WHERE tchan = '${tchan.id}' AND vchan = '${vchan.id}'`, (err, res) => {
                if (!err && res)
                    Embeds.default(chan, `Unlinked text channel <#${tchan.id}> from voice channel **\`${vchan.name}\`**.`)
                else
                    Embeds.error(chan, 'Failed unlinking channels because of an unexpcted error occured while accessing database.')
            })
            break

        default:
            chan1 = _getChan(args[0])
            chan2 = _getChan(args[1])

            if (
                (!chan1 || !chan2) ||
                (!(chan1.type == 'text' && chan2.type == 'voice' || chan1.type == 'voice' && chan2.type == 'text'))
            ) {
                Embeds.error(chan, 'Please enter a valid text and voice channel to link them together!', 'INVALID ARGUMENTS')
                return
            }
        
            vchan = chan1.type == 'voice' ? chan1 : chan2
            tchan = chan2.type == 'text' ? chan2 : chan1

            tchan.overwritePermissions(memb.roles.first(), {
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false
            })

            tchan.overwritePermissions(guild.me.roles.find(r => r.name == 'zekroBot'), {
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })
        
            Mysql.query(`INSERT INTO chanlinks (vchan, tchan, guild) VALUES ('${vchan.id}', '${tchan.id}', '${guild.id}')`, (err, res) => {
                if (!err && res)
                    Embeds.default(chan, `Linked text channel <#${tchan.id}> with voice channel **\`${vchan.name}\`**.`)
                else
                    Embeds.error(chan, 'An unexpected error occured while creating database entry. Linking failed.')
            })

    }


    
}