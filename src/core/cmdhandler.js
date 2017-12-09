const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')

class CmdHandler {
    constructor(client, prefix) {
        this.cmd = new CmdParser(client, prefix)

        this.cmd
            .register(require('../commands/info').ex, 'info', [], 'Get info about the bot', `\`${prefix}\`info`, this.cmd.type.MISC)

        this.cmd.event.on('commandFailed', (type, msg, err) => console.log(type, err))

        return this.cmd
    }
}

exports.CmdHandler = CmdHandler