const Colors = require('colors')
const Main = require('../main')


/**
 * Display error formated console output.
 * @param {string} content
 */
exports.error = (content) => {
    content.split('\n').forEach(s => {
        console.log(`${'[ERROR]'.red} ${s}`)
    })
}

/**
 * Display info formated console output.
 * @param {string} content
 */
exports.info = (content) => {
    content.split('\n').forEach(s => {
        console.log(`${'[INFO]'.cyan} ${s}`)
    })
}

/**
 * Display debug formated console output, if
 * program was started with debug arument
 * "-d" or "--debug".
 * Else function call will be ignored.
 * @param {string} content
 */
exports.debug = (content) => {
    if (Main.argv.indexOf('-d') > -1 || Main.argv.indexOf('-test') > -1) {
        content.split('\n').forEach(s => {
            console.log(`${'[INFO]'.yellow} ${s}`)
        })
    }    
}