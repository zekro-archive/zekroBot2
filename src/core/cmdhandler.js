const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')
const Embeds = require('../util/embeds')
const Guildpres = require('../util/guildpres')


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
            ownerpermlvl: 5,
        })

        this.cmd.setHost(Main.config.hostid)

        Guildpres.get(dbpres => this.cmd.setGuildPres(dbpres))

        this.cmd
            // AUTOCHANNEL COMMAND
            .register(
                require('../commands/autochannel').ex,
                'autochannel',
                ['autochan', 'ac', 'autochans'],
                'Manage automatic voice channels',
                `\`${prefix}autochannel set <channel>\n` +
                `\`${prefix}autochannel unset <channel>\n` +
                `\`${prefix}autochannel list\n`,
                this.cmd.type.GUILDADMIN,
                3
            )
            // BROADCAST COMMAND
            .register(
                require('../commands/broadcast').ex,
                'broadcast',
                ['bcast', 'bc'],
                'Send messages to all servers or server owners',
                `\`${prefix}broadcast owners <msg>\n` +
                `\`${prefix}broadcast all <msg>\n`,
                this.cmd.type.ADMIN,
                999
            )
            .register(
                require('../commands/brainfuck').ex,
                'bf',
                ['brainfuck', 'bfck'],
                'Execute some brainfuck code',
                `\`${prefix}bf -c <code> [-i "<input>"] [-v] [-b <cellsize>]\n`,
                this.cmd.type.MISC,
                0
            )
            // ID / WHOIS / WHATIS COMMAND
            .register(
                require('../commands/id').ex,
                'id',
                ['whois', 'whatis', 'identify'],
                'Get elements by ID or IDs of elements',
                `\`${prefix}id <ID>\n` +
                `\`${prefix}id <name>\n`,
                this.cmd.type.MISC,
                0
            )
            // RESTART COMMAND
            .register(
                require('../commands/restart').ex,
                'restart',
                [],
                'Restart the bot',
                `\`${prefix}restart\n`,
                this.cmd.type.ADMIN,
                100
            )
            // MVALL COMMAND
            .register(
                require('../commands/mvall').ex,
                'mvall',
                ['moveall', 'mv'],
                'Move all members in current channel to another',
                `\`${prefix}mvall <channel>\`\n`,
                this.cmd.type.MODERATION,
                2
            )
            // GUILD STATS COMMAND
            .register(
                require('../commands/guild').ex,
                'guild',
                ['guildstats', 'server'],
                'Get information about guild',
                `\`${prefix}guild\`\n`,
                this.cmd.type.MISC,
                0
            )
            // VOTE / POLL COMMAND
            .register(
                require('../commands/vote').ex,
                'vote',
                ['poll'],
                'Create a vote',
                `\`${prefix}vote <title> | <answer 1> | <answer 2> | <...>\`\n` +
                `\`${prefix}vote close\`\n`,
                this.cmd.type.CHAT,
                0
            )
            // QUOTE COMMAND
            .register(
                require('../commands/quote').ex,
                'quote',
                ['q'],
                'Quote a message of any channel in the guild',
                `\`${prefix}user <messageID>\`\n`,
                this.cmd.type.CHAT,
                0
            )
            // USER PROFILE COMMAND
            .register(
                require('../commands/user').ex,
                'user',
                ['member', 'userinfo', 'uinfo', 'profile'],
                'Get information about user on guild',
                `\`${prefix}user <user>\`\n` + 
                `\`${prefix}user\`\n`,
                this.cmd.type.MISC,
                0
            )
            // AUTOROLE COMMAND
            .register(
                require('../commands/autorole').ex,
                'autorole',
                ['guildrole', 'joinrole'],
                'Set the role users will automatically get after joining the guild',
                `\`${prefix}autorole <role>\`\n` + 
                `\`${prefix}autorole reset\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // INFO COMMAND
            .register(
                require('../commands/info').ex, 
                'info', 
                ['about'], 
                'Get info about the bot', 
                `\`${prefix}info\`\n`, 
                this.cmd.type.MISC
            )
            // TEST COMMAND
            .register(
                require('../commands/test').ex, 
                'test', 
                [], 
                'Just for testing purposes', 
                'no help\n', 
                'DEBUG',
                999
            )
            // PERMS COMMAND
            .register(
                require('../commands/perms').ex,
                'perms',
                ['permroles', 'perm', 'permlvl'],
                'Set the permission levels for specific roles',
                `\`${prefix}perms <LVL>, <role1>, <role2>, ...\`\n` + 
                `\`${prefix}perms list\`\n` +
                `\`${prefix}perms reset <lvl>\`\n`,
                this.cmd.type.SETTING,
                5
            )
            // GAME COMMAND
            .register(
                require('../commands/game').ex, 
                'game', 
                ['playing', 'botmsg'], 
                'Set messages the bot should show in playing text', 
                `\`${prefix}game msg <message 1>, <message 2>, ...\`\n` +
                `\`${prefix}game type <playing, streaming, listening, watching>\`\n` +
                `\`${prefix}game url <twitch url>\`\n` +
                `\`${prefix}game reset\`\n`,
                this.cmd.type.SETTING,
                999
            )
            // SAY COMMAND
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
                2
            )
            // EVAL COMMAND
            .register(
                require('../commands/eval').ex,
                'eval',
                ['evaluate', 'exec'],
                'evaluate code with this command',
                `\`${prefix}eval <js code>\`\n` +
                `\`${prefix}eval objects\`\n`,
                this.cmd.type.ADMIN,
                999
            )
            // PREFIX COMMAND
            .register(
                require('../commands/prefix').ex,
                'prefix',
                ['pre', 'guildpre', 'guildprefix'],
                'Register a guild specific prefix',
                `\`${prefix}prefix <new prefix>\`\n` +
                `\`${prefix}prefix\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // CLEAR COMMAND
            .register(
                require('../commands/clear').ex,
                'clear',
                ['purge', 'clean'],
                'Clear an ammount of messages in a chat',
                `\`${prefix}clear <ammount>\`\n` +
                `\`${prefix}clear <ammount> <user>\`\n` +
                `\`${prefix}prefix\`\n`,
                this.cmd.type.MODERATION,
                4
            )
            // REPORT COMMAND
            .register(
                require('../commands/report').ex,
                'report',
                ['rep'],
                'Report a user or get information about recent reports',
                `\`${prefix}report <VictimID/Mention>\`\n` +
                `\`${prefix}report list <ID/Mention>\`\n`,
                this.cmd.type.MODERATION,
                4
            )
            // SET CMD LOG CHANNEL COMMAND
            .register(
                require('../commands/setcmdlogchan').ex,
                'cmdlogchan',
                ['cmdlog'],
                'Set command log channel',
                `\`${prefix}cmdlogchan <channel>\`\n`,
                this.cmd.type.SETTING,
                4
            )
            // SET VOICE LOG CHANNEL COMMAND
            .register(
                require('../commands/setvoicelogchan').ex,
                'voicelogchan',
                ['voicelog'],
                'Set voice log channel',
                `\`${prefix}voicelogchan <channel>\`\n`,
                this.cmd.type.SETTING,
                4
            )
            // STUPS / NUDGE COMMAND
            .register(
                require('../commands/stups').ex,
                'stups',
                ['nudge', 'msg', 'pn'],
                'Send someone a nudge with the bot',
                `\`${prefix}stups <user> <message>\`\n`,
                this.cmd.type.CHAT,
                0
            )
            // BUG SUGGESTION COMMAND
            .register(
                require('../commands/bug').ex,
                'bug',
                ['suggestion', 'bugreport', 'issue'],
                'Get info how to submit a bug or suggestion',
                `\`${prefix}bug\`\n`,
                this.cmd.type.MISC,
                0
            )
            // XP LVL COMMAND
            .register(
                require('../commands/xpcmd').ex,
                'xp',
                ['lvl', 'level'],
                'Get information about your level status and guilds best list',
                `\`${prefix}xp\`\n` +
                `\`${prefix}xp <user>\`\n` +
                `\`${prefix}xp list\`\n`,
                this.cmd.type.MISC,
                0
            )
            // RANDOM 6 SIEGE COMMAND
            .register(
                require('../commands/rand6').ex,
                'rand6',
                ['r', 'r6'],
                'Play RANDOM6SIEGE© game',
                `\`${prefix}rand6 d\`\n` +
                `\`${prefix}rand6 a\`\n` +
                `\`${prefix}rand6 r\`\n` +
                `\`${prefix}rand6 list\`\n` +
                `\`${prefix}rand6 listops\`\n` +
                `\`${prefix}rand6 setops <URL>\`\n` +
                `\`${prefix}rand6 rules\`\n` +
                `\`${prefix}rand6 help\`\n`,
                this.cmd.type.FUN,
                0
            )
            // MUSIC COMMAND
            .register(
                require('../commands/music').ex,
                'music',
                ['m'],
                'Play music from youtube with the bot',
                `\`${prefix}music\`\n`,
                this.cmd.type.MISC,
                0
            )
            // GIF COMMAND
            .register(
                require('../commands/gif').ex,
                'gif',
                [],
                'Display some gifs from giphy',
                `\`${prefix}gif <search query> (<index>)\`\n`,
                this.cmd.type.CHAT,
                0
            )
            // SUGGESTION COMMAND
            .register(
                require('../commands/suggestion').ex,
                'suggest',
                ['wish'],
                'Submit your guggestions about this bot',
                `\`${prefix}suggest <message>\`\n`,
                this.cmd.type.CHAT,
                0
            )
            // NOTIFY CHANNEL COMMAND
            .register(
                require('../commands/msgchan').ex,
                'msgchan',
                ['notifychan'],
                'Set a text channel as notification message channel',
                `\`${prefix}msgchan (<name/ID>)\`\n` +
                `\`${prefix}msgchan reset\`\n`,
                this.cmd.type.SETTING,
                4
            )
            // JOINMSG COMMAND
            .register(
                require('../commands/joinmsg').ex,
                'joinmsg',
                ['joinmessage'],
                'Set a message appearing in notification channel when new member joins the guild',
                `\`${prefix}joinmsg <message ([m] -> member, [g] -> guild>\`\n`,
                this.cmd.type.SETTING,
                4
            )
            // JOINMSG COMMAND
            .register(
                require('../commands/leavemsg').ex,
                'leavemsg',
                ['leavemessage'],
                'Set a message appearing in notification channel when member leaves the guild',
                `\`${prefix}leavemsg <message ([m] -> member, [g] -> guild>\`\n`,
                this.cmd.type.SETTING,
                4
            )
            // VOICE KICK VKICK COMMAND
            .register(
                require('../commands/voicekick').ex,
                'vkick',
                ['voicekick'],
                'Kick a member out of its current voice channel',
                `\`${prefix}vkick <Member mention/ID/name>\`\n`,
                this.cmd.type.MODERATION,
                4
            )
            // KICK COMMAND
            .register(
                require('../commands/kick').ex,
                'kick',
                [],
                'Kick a member from the guild with reason and entry in reports database',
                `\`${prefix}kick <Member mention/ID> <reason>\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // BAN COMMAND
            .register(
                require('../commands/ban').ex,
                'ban',
                [],
                'Ban a member from the guild with reason and entry in reports database',
                `\`${prefix}ban <Member mention/ID> <reason>\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // CAT COMMAND
            .register(
                require('../commands/cat').ex,
                'cat',
                ['cats'],
                '😼',
                `\`${prefix}cat\`\n`,
                this.cmd.type.FUN,
                5
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