require('coffeescript/register');
require('extendutils')

const { Client, RichEmbed } = require('discord.js')
const Colors = require('colors')
const fs = require('fs')
const Cloc = require('./util/cloc')
const Logger = require('../src/util/logger')
const { CmdHandler } = require('./core/cmdhandler')
const { MySql } = require('./core/mysql')
const { Config } = require('./core/config')

const package = require('../package.json')

/********* V E R S I O N *********/
exports.VERSION = "0.18.1.0-beta"
/*********************************/

exports.package = package

exports.argv = process.argv

Logger.debug('Debug mode enabled')

// Config loader
var confHandler = new Config()
var config = confHandler.getConfig()

exports.mysql = new MySql(config.mysql)

// Client and CommandHandler setup
exports.client = new Client()
exports.config = config
exports.cmd = new CmdHandler(exports.client, config.prefix)

require('./events/eventregistry')
require('./core/xp')

exports.loadModLoader = () => {
    exports.modloader = require('./core/modloader')
}


exports.client.login(config.token)