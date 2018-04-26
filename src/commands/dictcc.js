const { client } = require('../main')
const Embeds = require('../util/embeds')
const dictcc = require('dictcc-js')
const { RichEmbed } = require('discord.js')
const { COLORS } = require('../util/statics')


const ENWORDS = {
    'BG': 'Bulgarian',
    'BS': 'Bosnian',
    'CS': 'Czech',
    'DA': 'Danish',
    'GE': 'German',
    'DE': 'German',
    'EN': 'English',
    'EL': 'Greek',
    'EO': 'Esperanto',
    'ES': 'Spanish',
    'FI': 'Finnish',
    'FR': 'French',
    'HR': 'Croatian',
    'HU': 'Hungarian',
    'IS': 'Icelandic',
    'IT': 'Italian',
    'LA': 'Latin',
    'NL': 'Dutch',
    'NO': 'Norwegian',
    'PL': 'Polish',
    'PT': 'Portuguese',
    'RO': 'Romanian',
    'RU': 'Russian',
    'SK': 'Slovak',
    'SQ': 'Albanian',
    'SR': 'Serbian',
    'SV': 'Swedish',
    'TR': 'Turkish'
  };


exports.ex = (msg, args) => {
    var chan = msg.channel

    if (!args[0] || !args[1] || !args[2]) {
        Embeds.invalidInput(chan, 'dict')
        return
    }

    var from = args[0].toUpperCase(), to = args[1].toUpperCase(), text = args.slice(2).join(' ')
    from = from == 'GE' ? 'DE' : from
    to = to == 'GE' ? 'DE' : to

    if (!ENWORDS[from])
        Embeds.error(chan, `Language identifier \`${from}\` is not available.\n\nAvailable language identifiers:\n\`\`\`${Object.keys(ENWORDS).join(', ')}\`\`\``)
    else if (!ENWORDS[to])
        Embeds.error(chan, `Language identifier \`${to}\` is not available.\n\nAvailable language identifiers:\n\`\`\`${Object.keys(ENWORDS).join(', ')}\`\`\``)
    else {
        dictcc.translate(from, to, text, (res, err) => {
            if (err) {
                Embeds.error(chan, 'An error occured: ```' + err + '```')
            }
            else {
                let res_from = res.slice(0, 10).map(r => r.from).join('\n')
                let res_to = res.slice(0, 10).map(r => r.to).join('\n')
    
                if (!res_from || !res_to) {
                    Embeds.error(chan, 'No results for `' + text + '`.')
                    return
                }

                let emb = new RichEmbed()
                    .setColor(COLORS.indigo)
                    .setTitle('dict.cc Translation Results')
                    .setDescription('```' + text + '```')
                    .addField(ENWORDS[from], res_from, true)
                    .addField(ENWORDS[to], res_to, true)
                
                chan.send('', emb)
            }
        })
    }
}