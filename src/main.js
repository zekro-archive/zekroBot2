require('coffeescript/register');
require('extendutils')
const { Client, RichEmbed } = require('discord.js')
const Colors = require('colors')
const fs = require('fs')

const Logger = require('../src/util/logger')
const { CmdHandler } = require('./core/cmdhandler')
const { MySql } = require('./core/mysql')

const package = require('../package.json')
exports.VERSION = package.version
exports.package = package

exports.argv = process.argv

// Config loader
if (!fs.existsSync('../config.json'))
    var config = require('../config.json')
else {
    Logger.error("Cant't find 'config.json' file!\nPlease download it here: " + "http://bot2.zekro.de/dl/config".bgRed)
    process.exit(-1)
}

Logger.debug('Debug mode enabled')

exports.mysql = new MySql(config.mysql)

// Client and CommandHandler setup
exports.client = new Client()
exports.config = config
exports.cmd = new CmdHandler(exports.client, config.prefix)

require('./events/eventregistry')

exports.loadModLoader = () => {
    exports.modloader = require('./core/modloader')
}


exports.client.login(config.token)