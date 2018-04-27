const https = require('https')
const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const PastebinAPI = require('pastebin-js')
const ArgParser = require('../util/argumentParser')


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
    
    var ap = new ArgParser(['t', 'l'])
    var parsed = ap.parse(cont)

    var title = parsed.vals.t
    var lang = parsed.vals.l
    var code = parsed.rest.trim()


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