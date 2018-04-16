const https = require('https')
const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const PastebinAPI = require('pastebin-js')


exports.ex = (msg, args) => {

    var chan = msg.channel
    var memb = msg.member
    var guild = memb.guild

    var API_KEY = Main.config.pastebin_api_key

    if (!args[0]) {
        Embeds.invalidInput(chan, 'pastebin')
        return
    }

    if (!API_KEY) {
        Embeds.error(chan, 'Pastebin command is not available. \nThe host of this bot has not entered a developer API key in the bots config.')
        return
    }

    var cont = args.join(' ')
    
    var title_match = cont.match(/-t=".*"(?=(\s|\n))|-t=[\w]*/gm)
    var lang_match = cont.match(/-l=[\w]*/gm)
    var title = title_match ? title_match[0].replace(/(-t=)|"/g, '') : null
    var lang = lang_match ? lang_match[0].replace(/(-l=)/g, '') : null
    var code = cont
        .replace(title_match ? title_match[0] : null, '')
        .replace(lang_match ? lang_match[0] : null, '')

    while (code.startsWith('\n'))
        code = code.substr(1)

    var pastebin = new PastebinAPI(API_KEY)

    pastebin.createPaste(code, title, lang, 1, '1M')
        .then(d => {
            console.log('test')
            Embeds.default(chan, `**${d}**\n\n*Attention: All created posts are unlisted and will be deleted after 1 month!*`, 'Paste created:')
        })
        .catch(err => {
            Logger.error(err)
            if (err.indexOf('Paste format js is unknown.') > -1) {
                Embeds.error(chan, 'Language is not valid!\n[**Here**](https://pastebin.com/api#5) *(pastebin.com)* you can find a list of all language keys.')
            } else {
                Embeds.error(chan, 'An error occured while creating paste:\n```' + err + '```')
            }
        })
}