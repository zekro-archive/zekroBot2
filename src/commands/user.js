const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const util = require('util');
const Xp = require('../core/xp')


function parse(chan, memb) {

    function _ornull(value, replacer) {
        return value ? value : (replacer ? replacer : '<n/a>')
    }

    function _gameToString(game) {
        let type = game.type == 0 ? 'Playing ' : (game.type == 1 ? 'Streaming ' : 'Listening to ')
        return type + game.name
    }

    let maxrole = memb.highestRole
    let user = memb.user

    let permlvl = Main.cmd.getPermLvl(memb)

    Xp.getParsedUserLvl(memb, (xp) => {
        Mysql.query(`SELECT * FROM reports WHERE victim = '${memb.id}'`, (err, res) => {
            let reports
            if (!err && res)
                reports = res.length == 0 ? 'This user has a white west  :ok_hand:' : `**${res.length}** reports on record`
            else
                reports = '*No data received*'
    
            let emb = new Discord.RichEmbed()
                .setTitle(memb.displayName + ' - User Info')
                .addField('User Tag', user.tag)
                .addField('Display Name', memb.displayName)
                .addField('ID', `\`\`\`${user.id}\`\`\``)
                .addField('Current Game', memb.presence.game ? _gameToString(memb.presence.game) : 'Not in game')
                .addField('Current Status', memb.presence.status)
                .addField('Joined Guild At', _ornull(memb.joinedAt))
                .addField('Created Account At', _ornull(user.createdAt))
                .addField('Permission Level', _ornull(permlvl, '0'))
                .addField('Roles', memb.roles.array().slice(1).map(r => `<@&${r.id}>`).join(', '))
                .addField('User Level', xp == '' ? '*No data*' : xp)
                .addField('Recent Reports', reports)
            
            if (maxrole && maxrole.color)
                emb.setColor(maxrole.color)
        
            if (user.avatarURL)
                emb.setThumbnail(user.avatarURL)
        
            chan.send('', emb)
        })
    })
}



exports.ex = (msg, args) => {

    let guild = msg.member.guild
    let chan = msg.channel

    if (args.length < 1) {
        parse(chan, msg.member)
        return
    }

    let memb = guild.members.find(m => m.id == args[0].replace(/(<@)|>/g, ''))
    if (!memb)
        memb = guild.members.find(
            m => m.displayName.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1 ||
                 m.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
        )
    if (!memb)
        Embeds.error(chan, `Could not fetch any member to the input \`\`\`${args.join(' ')}\`\`\``, 'INVALID INPUT')
    else
        parse(chan, memb)
}