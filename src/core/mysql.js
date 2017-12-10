const MySqlMod = require('mysql')
const Logger = require('../util/logger')

class MySql {
    constructor(config) {

        this.con = MySqlMod.createConnection({
            host:     config.host,
            user:     config.user,
            password: config.password,
            database: config.database
        })

        this.connect()
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
        this.con.query(command, cb)
    }

    getData(table, key, whereKey, whereValue, cb) {
        this.con.query(`SELECT * FROM ${table} WHERE '${whereKey}' = '${whereValue}'`, (err, res) => {
            if (err)
                cb(err, null)
            else
                cb(null, res[0][key])
        })
    }

    existsData(table, whereKey, whereValue, cb) {
        this.con.query(`SELECT * FROM ${table} WHERE '${whereKey}' = '${whereValue}'`, (err, res) => {
            if (err)
                cb(false, 'ERROR')
            else if (res.length == 0)
                cb(false, 'EMPTY_RES')
            else
                cb(true, 'TRUE')
        })
    }

    setData(table, key, value, whereKey, whereValue, cb) {
        this.existsData(table, whereKey, whereValue, (state) => {
            if (state)
                this.con.query(`UPDATE ${table} SET '${key}' = '${value}' WHERE '${whereKey}' = '${whereValue}'`, cb)
            else
                this.con.query(`INSERT INTO ${table} (${whereKey}, ${key}) VALUES ('${whereValue}', '${value}')`, cb)
        })
    }
}

exports.MySql = MySql