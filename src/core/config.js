const fs = require('fs')
const Logger = require('../util/logger')
const util = require('util')



const CONF_TEMPLATE = {
    token: "",
    giphy_key: "",
    youtube_api_key: "",
    prefix: "zb:",
    hostid: "",
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

class Config {

    constructor(conf_file) {
        this.conf_file = conf_file ? conf_file : "config.json"
        this.load()
    }

    load() {
        if (fs.existsSync(this.conf_file)) {
            let config_raw = fs.readFileSync(this.conf_file, 'utf8')
                .replace(/((\/\*)((.|\n)[^\*\/])*(\*\/))|(\s*(\/\/).*)/gm, '')

            try {
                this.config = JSON.parse(config_raw)
            }
            catch (e) {
                Logger.error("Could not parse config.json. Please delete or rename the file and restart the porgram to regenerate a new template.")
                process.exit()
            }
        }
        else {
            this.create()
            Logger.error("Config file not existent and was generated. Please edit the config and restart.")
            process.exit()
        }
    }

    create() {
        let out =  '/*\n' +
                   '    If you need help creating the config, take a look into the wiki page:\n' +
                   '    https://github.com/zekroTJA/zekroBot2/wiki/Config-Explaination\n' +
                   '*/\n\n\n'

        out += JSON.stringify(CONF_TEMPLATE, null, 2)
        fs.writeFileSync(this.conf_file, out)
    }

    getConfig() {
        Logger.debug(util.inspect(this.config))
        return this.config
    }
}

exports.Config = Config
