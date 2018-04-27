const Main = require('../main')
const client = Main.client
const Embeds = require('../util/embeds')
const https = require('https')


exports.ex = (msg, args) => { 

    const ArgParser = require('../util/argumentParser')

    let ap = new ArgParser(['f', 'd'])
    console.log(ap.parse('asd asdasd -f sad123'))
}