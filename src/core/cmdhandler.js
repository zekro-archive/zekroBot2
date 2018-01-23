const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')
const Embeds = require('../util/embeds')


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

        this.cmd.setOptions({
            guildonwerperm: 5,
        })

        this.cmd.setHost(Main.config.hostacc)

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
                99
            )
            // PERMS COMMAND
            .register(
                require('../commands/perms').ex,
                'perms',
                ['permroles', 'perm', 'permlvl'],
                'Set the permission levels for specific roles',
                `\`${prefix}perms <LVL>, <role1>, <role2>, ...\`\n\`${prefix}perms list\``,
                this.cmd.type.SETTING,
                5
            )
            // GAME COMMAND
            .register(
                require('../commands/game').ex, 
                'game', 
                ['playing', 'botmsg'], 
                'Set messages the bot should show in playing text', 
                `\`${prefix}game <message 1>, <message 2>, ...\`\n\`${prefix}game reset\``,
                this.cmd.type.SETTING,
                99
            )
            .register(
                require('../commands/say').ex,
                'say',
                ['saymsg'],
                'Send an embed message with the bot',
                `\`${prefix}say <message>\`\n` +
                `\`${prefix}say -e <message>\`\n` +
                `\`${prefix}say -e:<color> <message>\`\n` +
                `\`${prefix}say colors\`\n`,
                this.cmd.type.CHAT,
                3
            )
            .register(
                require('../commands/eval').ex,
                'eval',
                ['evaluate', 'exec'],
                'evaluate code with this command',
                `\`${prefix}eval <js code>\`\n` +
                `\`${prefix}eval objects\`\n`,
                this.cmd.type.ADMIN,
                99
            )

        this.cmd.event.on('commandFailed', (type, msg, err) => 
            console.log(type, err)
        )
        this.cmd.event.on('commandFailed', (type, msg, err) => 
            Embeds.error(msg.channel, `Error Type: *\`${type}\`*\n\nError:\n\`\`\`\n${err}\n\`\`\``, "COMMAND ERROR")
        )

        return this.cmd
    }
}

exports.CmdHandler = CmdHandler