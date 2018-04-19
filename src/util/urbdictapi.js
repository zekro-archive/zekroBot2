/**
 * © 2018-present Ringo Hoffmann (zekro Development)
 * zekro.de | contact@zekro.de
 * READ BEFORE USAGE: http://zekro.de/policy
 * 
 * ATTENTION:
 * This code is inspired and refers on the code from
 * mvrilo's Project 'urban' on GitHub:
 * https://github.com/mvrilo/urban/blob/master/lib/urban.js#L66
 */

const https = require('https')

// The URL the HTTPS GET request will be executed
const API_HOST = "api.urbandictionary.com"

/**
 * Just a helpful function to parse some options to pass
 * to the GET function over path into url form.
 * @private
 * @param   {object} options API GET arguments
 * @returns {string} URL form converted arguments
 */
function _assembleUriOptions(options) {
    return Object.keys(options).map((k, i) => {
        let initializer = i == 0 ? '?' : '&'
        return `${initializer}${k}=${options[k].toString().replace(/\s/g, '%20')}`
    }).join('')
}

/**
 * The HTTPS GET function.
 * @private
 * @param {string}   endpoint API endpoint 
 * @param {options}  options  Options passing through GET request via URL
 * @param {function} cb       Callback function to get JSON data
 */
function _get(endpoint, options, cb) {
    let getopts = {
        host: API_HOST,
        path: `/v0/${endpoint}${options ? _assembleUriOptions(options) : ''}`
    }
    https.get(getopts, res => {
        let data = ''
        res.on('data', d => {
            data += d.toString('utf8')
        }).on('end', () => {
            let jsondata = JSON.parse(data)
            cb(jsondata)
        })
    })
}

/**
 * UrbanDictionary class.
 * Required no constructor arguments.
 */
class UrbanDictionary {

    /**
     * Get a random entry from urban dictionary.
     * @public
     * @param   {number}  index Index of entry
     * @returns {Promise} resolves with JSON data
     */
    getRandom(index) {
        return new Promise(resolve => {
            _get('random', null, data => {
                resolve(data.list[index ? index : 0])
            })
        })
    }

    /**
     * Get an entry from urban dictionary by search query.
     * @public
     * @param   {string} term  Query string to search for in urban dictionary
     * @param   {number} index Index of entry
     * @returns {Promise} resolves with JSON data 
     */
    getDefinition(term, index) {
        return new Promise(resolve => {
            if (!index) index = 0
            _get('define', { page: 0, term }, data => {
                resolve(data.list[index ? index : 0])
            })
        })
    }

}


module.exports = UrbanDictionary