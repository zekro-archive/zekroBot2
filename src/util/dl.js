const https = require('https')


function get(url, cb) {
    if (!cb)
        return
    https.get(url, (res) => {
        var data = ''
        res.on('data', (d) => {
            data += d.toString('utf8')
        });
        res.on('end', () => {
            cb(null, data)
        })
    }).on('error', (err) => {
        if (cb)
            cb(err)
    })

}

module.exports = {
    get
}