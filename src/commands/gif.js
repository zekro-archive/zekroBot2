const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const https = require('https')


exports.ex = (msg, args) => { 

    var chan = msg.channel
    var cont = args.join(' ')

    if (!args[0]) {
        Embeds.error(chan, 'Enter `zb:help gif` to get how to use this command!', 'INVALID ARGUMENTS')
        return
    }

    if (!Main.config.giphy_key || Main.config.giphy_key.length < 5) {
        Embeds.error(chan, 'This command can only be used with a valid Giphy API-Key.\nPlease contact the host of this bot to enter it in the config file of the bot.', 'NO API KEY ERROR')
        return
    }

    var query = cont
        .replace(/(-i=\d)/gm, '')
        .trim()
        .replace(/\s/gm, '%20')
    var index = (() => {
        let _match = cont.match(/(-i=\d)/gm)
        return _match && parseInt(_match[0].split('=')[1]) >= 0 ?
               parseInt(_match[0].split('=')[1]) : 0
    })()

    https.get(`https://api.giphy.com/v1/gifs/search?api_key=${Main.config.giphy_key}&q=${query}`, (res) => {
        let data = ''
        res.on('data', (d) => {
            data += d.toString('utf8')
        })
        res.on('end', () => {
            try {
                let jdata = JSON.parse(data)
            }
            catch (err) {
                Embeds.error(chan, `An error occured while parsing request answer:\n \`\`\`${err}\`\`\``)
                return
            }
            if (index > jdata.data.length - 1)
                index = 0
            if (!jdata.data[index]) {
                Embeds.error(chan, `No results for the entered query \`${query}\``)
                return
            }
            chan.send(`[${msg.member.displayName}]\n${jdata.data[index].url}`)
                .then(() => msg.delete())
        })
    }).on('error', (err) => {
        Embeds.error(chan, 'An error occured while requesting Gif list from giphy: ```' + err + '```', 'REQUEST ERROR')
    })
}