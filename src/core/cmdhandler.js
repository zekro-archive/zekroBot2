const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')

class CmdHandler {
    constructor(client, prefix) {
        this.cmd = new CmdParser(client, prefix)

        return this.cmd
    }
}