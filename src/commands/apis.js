const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')
const https = require('https')



const ENDPOINTS = {
    "zekro.de":             "https://zekro.de/api/cats/",
    "github.com":           "https://api.github.com/",
    "giphy.com":            "https://api.giphy.com/v1/",
    "dict.cc":              "https://www.dict.cc/",
    "urbandictionary.com":  "https://api.urbandictionary.com/",
    "tombstonebuilder.com": "http://www.tombstonebuilder.com/generate.php"
}


function checkApi(url, cb) {
    let req = https.get(url, res => {
        res.on('data', () => {})
        res.on('end', () => cb(true))
    }).on('error', () => cb(false))
    req.end()
}

function buildMessageEmbed(status) {
    var urls = ''
    var stats = ''
    if (Object.keys(status).length == 0)
        urls = stats = '-'
    else {
        Object.keys(status).forEach(api => {
            urls += api + '\n'
            stats += status[api] + '\n'
        })
    }
    return emb = new Discord.RichEmbed()
        .setTitle('API Status')
        .setColor(Statics.COLORS.main)
        .addField('API', urls, true)
        .addField('Status', stats, true)
}


exports.ex = (msg, args) => {

    var chan = msg.channel
    var status = {}
    chan.send('', buildMessageEmbed(status)).then(tmsg => {

        Object.keys(ENDPOINTS).forEach(api => {
            let url = ENDPOINTS[api]
            status[api] = "checking..."
            tmsg.edit('', buildMessageEmbed(status))
            checkApi(url, ok => {
                status[api] = ok ? `OK` : 'FAIL'
                tmsg.edit('', buildMessageEmbed(status))
            })
        })

    })
}