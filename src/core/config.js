const fs = require('fs')
const Logger = require('../util/logger')
const util = require('util')

const CONF_TEMPLATE = {
    token: "",
    giphy_key: "",
    youtube_api_key: "",
    pastebin_api_key: "",
    prefix: "zb:",
    hostid: "",
    logcmds: true,
    mysql: {
        host: "localhost",
        user: "",
        password: "",
        database: "zekroBot2"
    },
    exp: {
        interval: 10,
        xpinterval: 15,
        xpmsgmultiplier: 150,
        flatter: 100,
        cap: 0.8,
        delta: 1.2,
        startlvl: 1000,
        reports: [
            10000,
            5
        ]
    }
}

const TEST_CONF = {
    token: "",
    giphy_key: "",
    youtube_api_key: "",
    pastebin_api_key: "",
    prefix: "zb:",
    hostid: "221905671296253953",
    logcmds: true,
    mysql: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "zekroBot2"
    },
    exp: {
        interval: 10,
        xpinterval: 15,
        xpmsgmultiplier: 150,
        flatter: 100,
        cap: 0.8,
        delta: 1.2,
        startlvl: 1000,
        reports: [
            10000,
            5
        ]
    }
}


class Config {

    constructor(conf_file, testing) {
        this.conf_file = conf_file ? conf_file : "config.json"
        this.load(testing)
    }

    load(testing) {
        if (testing) {
            this.config = TEST_CONF
            return
        }
        if (fs.existsSync(this.conf_file)) {
            let config_raw = fs.readFileSync(this.conf_file, 'utf8')
                .replace(/\/\/[^\n]*/gm, '')
            try {
                this.config = JSON.parse(config_raw)
            }
            catch (e) {
                Logger.error("Could not parse config.json. Please delete or rename the file and restart the porgram to regenerate a new template.")
                Logger.info('Please take a look in your config. If there are any comments with \\* and *\\, please delete them because they are not supportet anymore.')
                console.log(e)
                process.exit()
            }
        }
        else {
            this.createWithInput()
            // Logger.error("Config file not existent and was generated. Please edit the config and restart.")
            Logger.info("Config file created as 'config.json' in root directory.")
            process.exit()
        }
    }

    create(config) {
        let out = '\n// If you need help creating the config, take a look into the wiki page:\n' +
                  '// github.com/zekroTJA/zekroBot2/wiki/Config-Explaination\n' +
                  '\n\n';
        out += JSON.stringify(config, null, 2)
        fs.writeFileSync(this.conf_file, out)
    }

    createWithInput() {
        var rl = require('readline-sync')
        var resp, config = CONF_TEMPLATE

        console.log('\nCONFIG CREATOR\n\n\
                     \rIf you need help with some config keys, please read this:\n\
                     \rhttp://bot.zekro.de/wiki/Config-Explaination\n')

        // TOKEN
        resp = rl.question('\n[REQUIRED] Please enter your Discord bot token:\n')
        while (resp.length < 50) {
            Logger.error('Invalid input. Please input a valid token.')
            resp = rl.question('[REQUIRED] Please enter your Discord bot token:\n')
        }
        config.token = resp

        // HOSTID
        resp = rl.question('\n[REQUIRED] Please enter your Discord Account ID (to identify that you are the host of the bot):\n')
        while (resp.length < 15 || !parseInt(resp)) {
            Logger.error('Invalid input. Please input a valid user ID.')
            resp = rl.question('[REQUIRED] Please enter your Discord Account ID (to identify that you are the host of the bot):\n')
        }
        config.hostid = resp

        // MYSQL.HOST
        resp = rl.question('\n[REQUIRED] Please enter MySQL host IP (defaultly localhost/127.0.0.1):\n')
        while (resp.length < 3) {
            Logger.error('Invalid input. This key is required.')
            resp = rl.question('[REQUIRED] Please enter MySQL host IP (defaultly localhost/127.0.0.1):\n')
        }
        config.mysql.host = resp

        // MYSQL.USER
        resp = rl.question('\n[REQUIRED] Please enter MySQL user (defaultly zekroBot2):\n')
        while (resp.length < 3) {
            Logger.error('Invalid input. This key is required.')
            resp = rl.question('[REQUIRED] Please enter MySQL user (defaultly zekroBot2):\n')
        }
        config.mysql.user = resp

        // MYSQL.PASSWORD
        resp = rl.question('\n[REQUIRED] Please enter MySQL password for user:\n')
        while (resp.length < 3) {
            Logger.error('Invalid input. This key is required.')
            resp = rl.question('[REQUIRED] Please enter MySQL password for user:\n')
        }
        config.mysql.password = resp

        // MYSQL.DATABASE
        resp = rl.question('\n[REQUIRED] Please enter MySQL database (defaultly zekroBot2):\n')
        while (resp.length < 3) {
            Logger.error('Invalid input. This key is required.')
            resp = rl.question('[REQUIRED] Please enter MySQL database (defaultly zekroBot2):\n')
        }
        config.mysql.database = resp

        // Giphy Token
        resp = rl.question('\n[OPTIONAL] Please enter your Giphy API key (<enter> if notset):\n')
        if (resp)
            config.giphy_key = resp
        
        // YouTube Token
        resp = rl.question('\n[OPTIONAL] Please enter your YouTuve API v3 token (<enter> if notset):\n')
        if (resp)
            config.youtube_api_key = resp
        
        // Pastebin Token
        resp = rl.question('\n[OPTIONAL] Please enter your Pastebin API token (<enter> if notset):\n')
        if (resp)
            config.pastebin_api_key = resp

        this.create(config)
    }

    getConfig() {
        Logger.debug(util.inspect(this.config))
        return this.config
    }

}

exports.Config = Config