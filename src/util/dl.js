const Main = require('../main')
const client = Main.client
const https = require('https')
const Statics = require('../util/statics')


function get(url, cb) {

    https.get(url, (res) => {
        res.on('data', (d) => {
            cb(null, d.toString('utf8'))
        });
    }).on('error', (err) => {
        if (cb)
            cb(err)
    })

}

module.exports = {
    get
}