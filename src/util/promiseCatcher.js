const Logger = require('./logger')
const Funcs = require('./funcs')
const fs = require('fs')

class PromiseCatcher {

    constructor(location) {

        this.location = location ? location : './crash_logs'

        Object.assign(Promise.prototype, {      
            save() {
                this.catch(e => {
                    Logger.error(e.toString())
                    try {
                        if (!fs.existsSync(this.location))
                            fs.mkdirSync(this.location)

                        const save_file = `${this.location}/${Funcs.getTime(true)}_promiseCatch.log`
                        
                        fs.writeFileSync(save_file, 
                            `TIME:      ${Funcs.getTime()}\n` + 
                            `TYPE:      ${e.name}\n` + 
                            `MESSAGE:   ${e.message}\n\n\n` + 
                            `STACK TRACE:\n\n${e.stack}\n`
                        )
                    }
                    catch (e) {
                        return this
                    }
                    return this
                })
                return this
            }  
        })
    }
    
}

module.exports = PromiseCatcher