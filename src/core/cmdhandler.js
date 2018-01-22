const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')


/*
    TYPES:

    ADMIN:          ADMIN
    GUILDADMIN:     GUILDADMIN
    MODERATION:     MODERATION
    FUN:            FUN
    SETTING:        SETTING
    CHAT:           CHAT
    MISC:           MISC

*/

class CmdHandler {
    constructor(client, prefix) {
        this.cmd = new CmdParser(client, prefix)

        this.cmd.addType('DEBUG')

        this.cmd
            // INFO COMMAND
            .register(
                require('../commands/info').ex, 
                'info', 
                ['about'], 
                'Get info about the bot', 
                `\`${prefix}info\``, 
                this.cmd.type.MISC
            )
            // TEST COMMAND
            .register(
                require('../commands/test').ex, 
                'test', 
                [], 
                'Just for testing purposes', 
                null, 
                'DEBUG',
                5
            )
            .register(
                require('../commands/perms').ex,
                'perms',
                ['permroles', 'perm', 'permlvl'],
                'Set the permission levels for specific roles',
                `\`${prefix}perms <LVL>, <role1>, <role2>, ...\`\n\`${prefix}perms list\``,
                this.cmd.type.SETTING,
                4
            )
            // GAME COMMAND
            .register(
                require('../commands/game').ex, 
                'game', 
                ['playing', 'botmsg'], 
                'Set messages the bot should show in playing text', 
                `\`${prefix}game <message 1>, <message 2>, ...\`\n\`${prefix}game reset\``,
                this.cmd.type.SETTING,
                4
            )

        this.cmd.event.on('commandFailed', (type, msg, err) => console.log(type, err))

        return this.cmd
    }
}

exports.CmdHandler = CmdHandler