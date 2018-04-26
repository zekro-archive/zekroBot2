const fs = require('fs')
const Logger = require('../util/logger')
const Main = require('../main')

var loadedMods = 0, ignoredMods = 0
var normalizedPath = require("path").join(__dirname, "..", "modules");

var ignored = Main.config.ignoredModules

// Load all modules files from ../modules
fs.readdirSync(normalizedPath).forEach(f => {
    if (!(ignored && ignored.find(x => f.startsWith(x)) == null)) {
        require('../modules/' + f)
        loadedMods++
    }
    else
        ignoredMods++
})

Logger.info(`Loaded ${loadedMods} modules, ignored ${ignoredMods} modules`)