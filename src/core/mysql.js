const MySqlMod = require('mysql')
const fs = require('fs')
const Logger = require('../util/logger')

class MySql {
    constructor(config) {

        this.config = config
        this.executedQueries = 0

        this.con = MySqlMod.createConnection({
            host:     config.host,
            user:     config.user,
            password: config.password,
            database: config.database
        })

        this.connect({
            charset: 'utf8mb4'
        })
    }

    connect() {
        this.con.connect((err) => {
            if (err)
                Logger.error('Failed connecting to MySql database')
            else
                Logger.info('Successfully connected to MySql database')
        })  
    }

    get conn() {
        return this.con
    }

    query(command, cb) {
        try {
            this.con.query(command, cb)
            this.executedQueries++
        } catch (e) {
            Logger.error(e.toString())
            cb(null, null)
        }
    }
}

exports.MySql = MySql