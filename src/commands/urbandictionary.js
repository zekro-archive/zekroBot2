const Main = require('../main')
const client = Main.client
const Discord = require('discord.js')
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')
const UrbDict = require('../util/urbdictapi')


var ud = new UrbDict()


function _sendMsg(chan, data) {
    chan.send('', new Discord.RichEmbed()
        .setColor(0xEFFF00)
        .setTitle(`UrbanDictionary: \`${data.word}\``)
        .addField('Word', `[**${data.word}**](${data.permalink})`)
        .addField('Definition', data.definition)
        .addField('Example', data.example)
        .addField('Rating', `:thumbsup:  ${data.thumbs_up}      :thumbsdown:  ${data.thumbs_down}`)
    )
}

exports.ex = (msg, args) => {

    var chan = msg.channel

    var _argstr = args.join(' ')
    var query = _argstr.replace(/(-i=\d)/, '').trim()
    var index = (() => {
        let match = _argstr.match(/(-i=\d)/)
        if (!match) return 0
        let ind = parseInt(match[0].split('=')[1])
        return ind ? ind : 0
    })()

    if (query == '') {
        ud.getRandom(index)
            .then(data => _sendMsg(chan, data))
            .catch(err => Embeds.error(chan, 'An error occured:\n```' + err + '```'))
    }
    else {
        ud.getDefinition(query, index)
            .then(data => _sendMsg(chan, data))
            .catch(err => Embeds.error(chan, 'An error occured:\n```' + err + '```'))
    }
}