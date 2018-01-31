var Main = require('../main')
var fs = require('fs')
var cmds = Main.cmd.helplist
var Logger = require('../util/logger')

var output = ""

/*
{ autochannel:
   { cmdfunc: [Function],
     invoke: 'autochannel',
     aliases: [ 'autochan', 'ac', 'autochans' ],
     description: 'Manage automatic voice channels',
     help: '`zb:autochannel set <channel>\n`zb:autochannel unset <channel>\n`zb:autochannel create <list>\n',
     type: 'GUILDADMIN',
     perm: 3 },
  ...
}
*/


Object.keys(cmds).forEach(i => {

        let c = cmds[i]
        let help = c.help.replace(/`/g, '')
        output += `### ${i}\n\n` +
                  `> ${c.description}\n\n` +
                  '| | |\n' +
                  '| --------- | --------- |\n' +
                  `| Permission | ${c.perm} |\n` +
                  `| Group | ${c.type} |\n` +
                  `| Aliases | ${c.aliases.map(a => `- ${a}`).join('</br>')} |\n\n` +
                  '**Usage**\n\n' +
                  '```php\n' +
                  help +
                  '```\n\n\n'
})
    
fs.writeFile('commands.md', output, (err, res) => {
    if (!err)
        Logger.debug('Successfully created "commands.md"')
})