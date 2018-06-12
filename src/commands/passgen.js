const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Statics = require('../util/statics')


const ASCII_CHARSET = (() => {
    var out = ''
    for (var i = 32; i < 128; i++) {
        out += (String.fromCharCode(i))
    }
    return out
})()

const LEVELS = [
    /[a-z]|\d/g,              // 0
    /[a-z]|[A-Z]|\d/g,        // 1
    /\w|\d/g,                 // 2
    /\w|\d|[!"§$%&/()=?-]/g,  // 3
    /./g                      // 4
]


exports.ex = (msg, args) => {

    var chan = msg.channel
    var memb = msg.member
    var guild = memb.guild

    var length = parseInt(args[0]) ? args[0] : 8
    var level = args[1] ? parseInt(args[1]) : 3

    if (length < 7) {
        Embeds.error(chan, 'You should never use a password shorter than 6 characters!')
        return
    }

    if (length > 1024) {
        Embeds.error(chan, 'I can\'t handle such big numbers! :sweat:')
        return
    }

    if (level && (level > 4 || level < 0)) {
        Embeds.error(chan, 'Please chose a safety level between `0` and `4` or use a regular expession!')
        return
    }

    var regex = level ? LEVELS[level] : new RegExp(args[1], 'g')
    console.log(regex)
    var charset = ASCII_CHARSET.match(regex)

    var result = ''

    for (var i = 0; i < length; i++)
        result += charset[Math.floor(Math.random() * charset.length)]
    
    memb.createDM().then(dm => {
        Embeds.default(dm, 
            `:warning:  **This message will be automatically deleted after 30 seconds!**\n\n**Your generated password is:**` +
            `\`\`\`${result}\`\`\`` +
            `Used parameters:\n:white_small_square:  Length: \`${length}\`\n` +
            `:white_small_square:  Charset-Filter: \`${regex}\``
        ).then(m => {
            m.delete(30000)
            Embeds.default(chan, 'Look in your DM to see your password.')
                .then((m) => m.delete(15000))
        })
    })
}