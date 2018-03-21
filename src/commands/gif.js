const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const https = require('https')


exports.ex = (msg, args) => { 

    var chan = msg.channel

    if (!args[0]) {
        Embeds.error(chan, 'Enter `zb:help gif` to get how to use this command!', 'INVALID ARGUMENTS')
        return
    }

    if (!Main.config.giphy_key || Main.config.giphy_key.length < 5) {
        Embeds.error(chan, 'This command can only be used with a valid Giphy API-Key.\nPlease contact the host of this bot to enter it in the config file of the bot.', 'NO API KEY ERROR')
        return
    }

    var ind_ind = 1
    query = (function() {
        if (!args[0].startsWith('"'))
            return args[0]
        let out = '', i = 0;
        do {
            if (!args[i])
                return args[0]
            out += args[i] + "%20"
        }
        while (!args[i++].endsWith('"'))
        ind_ind = i
        return out.substring(1, out.length - 4)
    })()

    index = (args[ind_ind] && parseInt(args[ind_ind]) && parseInt(args[ind_ind]) > -1) ? parseInt(args[ind_ind]) : 0
    console.log(query, index)

    https.get(`https://api.giphy.com/v1/gifs/search?api_key=${Main.config.giphy_key}&q=${query}`, (res) => {
        let data = ''
        res.on('data', (d) => {
            data += d.toString('utf8')
        })
        res.on('end', () => {
            jdata = JSON.parse(data)
            if (index > jdata.data.length - 1)
                index = 0
            chan.send(`[${msg.member.displayName}]\n${jdata.data[index].url}`)
                .then(() => msg.delete())
        })
    }).on('error', (err) => {
        Embeds.error(chan, 'An error occured while requesting Gif list from giphy: ```' + err + '```', 'REQUEST ERROR')
    })

}