const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const Statics = require('../util/statics')

const ACHandler = require('../core/autochanhandler')


exports.ex = (msg, args) => {

    if (args.length < 1) {
        Embeds.invalidInput(msg.channel, 'mvall')
        return
    }

    let guild = msg.member.guild

    let chan = guild.channels
        .filter(c => c.type == 'voice')
        .sort((a, b) => a.position - b.position)
        .find(c => c.id == args[0] ||
                   c.name.toLowerCase() == args.join(' ').toLowerCase() ||
                   c.name.toLowerCase().startsWith(args.join(' ').toLowerCase()) || 
                   c.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1)
    // let chan = guild.channels.find(c => c.id == args[0] && c.type == 'voice')
    // if (!chan)
    //     chan = guild.channels.find(c => c.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1 && c.type == 'voice')
    if (!chan)
        Embeds.error(msg.channel, `Can not fetch any voice channel to the input \`\`\`${args.join(' ')}\`\`\``)
    else {
        let cvc = msg.member.voiceChannel
        if (cvc) {
            Logger.debug('IsAutochannel: ' + ACHandler.get().indexOf(chan.id))
            if (ACHandler.get().indexOf(chan.id) > -1) {
                function _acmovehandler(vc) {
                    cvc.members.forEach(m => {
                        try {
                            m.setVoiceChannel(vc)
                        }
                        catch (e) {}
                    })
                    ACHandler.event.removeListener('created', _acmovehandler)
                }
                cvc.members.first().setVoiceChannel(chan).then(m => {
                    ACHandler.event.on('created', _acmovehandler)
                })
            } else {
                cvc.members.forEach(m => {
                    try {
                        m.setVoiceChannel(chan)
                    }
                    catch (e) {}
                })
            }
            Embeds.default(msg.channel, `Moved all voice members from channel \`${cvc.name}\` to channel \`${chan.name}\``)
        }
        else {
            Embeds.error(msg.channel, 'You need to be in a voice channel to use this command!')
        }
    }
}