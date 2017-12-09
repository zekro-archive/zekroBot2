require('coffeescript/register');
require('extendutils')
const { Client, RichEmbed } = require('discord.js')
const Colors = require('colors')
const fs = require('fs')

const Logger = require('../src/util/logger')
const { CmdHandler } = require('./core/cmdhandler')

const package = require('../package.json')
exports.VERSION = package.version

// Config loader
if (!fs.existsSync('../config.json'))
    var config = require('../config.json')
else {
    Logger.error("Cant't find 'config.json' file!\nPlease download it here: " + "http://bot2.zekro.de/dl/config".bgRed)
    process.exit(-1)
}

// Client and CommandHandler setup
exports.client = new Client()
exports.config = config
exports.cmd = new CmdHandler(exports.client, config.prefix)

require('./events/eventregistry')


exports.client.login(config.token)