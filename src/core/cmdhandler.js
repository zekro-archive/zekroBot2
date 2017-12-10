const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')


class CmdHandler {
    constructor(client, prefix) {
        this.cmd = new CmdParser(client, prefix)

        this.cmd.addType('DEBUG')

        this.cmd
            .register(require('../commands/info').ex, 'info', [], 'Get info about the bot', `\`${prefix}\`info`, this.cmd.type.MISC)
            .register(require('../commands/test').ex, 'test', [], 'Just for testing purposes', null, 'DEBUG')

        this.cmd.event.on('commandFailed', (type, msg, err) => console.log(type, err))

        return this.cmd
    }
}

exports.CmdHandler = CmdHandler