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


function get_ua(url, cb) {
    if (!cb)
        return
    var options = {
        hostname: url.split('/')[2],
        path: '/' + url.split('/').slice(3).join('/'),
        headers: { 'user-agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)' }
    }
    https.get(options, (res) => {
        var data = ''
        res.on('data', (d) => {
            data += d.toString('utf8')
        });
        res.on('end', () => {
            cb(null, data)
            console.log(options)
        }).on('error', (err) => {
            if (cb)
                cb(err)
        })    
    })
}


module.exports = {
    get,
    get_ua
}