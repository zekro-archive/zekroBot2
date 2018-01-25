const fs = require('fs')
const Logger = require('../util/logger')

var loadedMods = 0
var normalizedPath = require("path").join(__dirname, "..", "modules");

// Load all modules files from ../modules
fs.readdirSync(normalizedPath).forEach(f => {
    require('../modules/' + f)
    loadedMods++
})

Logger.info(`Loaded ${loadedMods} modules`)