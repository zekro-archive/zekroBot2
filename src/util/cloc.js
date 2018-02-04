const Main = require('../main')
const client = Main.client
const https = require('https')
const Statics = require('../util/statics')


const URL = Statics.DIRS.cloc


function requestCont(cb) {

    var request = https.request(URL, (res) => {
        var out = ''
        res.setEncoding('utf8')

        res.on('data', (chunk) => {
            out += chunk
        })

        res.on('end', () => {
            cb(null, out)
        })
    })

    request.on('error', (err) => {
        cb(err, null)
    })

    request.end()
}


function getLines(cb) {

    requestCont((err, res) => {

        if (err)
            cb(err, null)
        else {
            var split = res.split('\n')
                .filter(s => !s.startsWith('---') && !s.startsWith(':--') && !s.startsWith('Language') && !s.startsWith('cloc') && s != '')
                .map(s => s.replace(/:/g, ''))
            var out = {}
            split.forEach(l => {
                let lsplit = l.split('|')
                out[lsplit[0]] = lsplit[4]
            })
            cb(null, out)
        }

    })

}


exports.getLines = getLines