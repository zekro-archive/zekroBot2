/*

MODULE INFO:
- name:         Help Parser
- version:      1.2
- creator:      zekro (github.com/zekrotja)
- last edited:  2018/03/19

MODULE DESCRIPTION:
This module is just for creating an Markdown formatted file which contains 
various information about commands, which can be implemented into the
main Readme document.

*/


var Main = require('../main')
var fs = require('fs')
var cmds = Main.cmd.helplist
var Logger = require('../util/logger')

var output = '# Commands\n\n'
var head = '# Commands index\n\n'

Object.keys(cmds).sort().forEach(i => {

        let c = cmds[i]
        let help = c.help.replace(/`/g, '')

        head += `- [${i}](https://github.com/zekroTJA/zekroBot2/wiki/Commands#${i})\n`

        output += `## ${i}\n\n` +
                  `> ${c.description}\n\n` +
                  '| | |\n' +
                  '| --------- | --------- |\n' +
                  `| Permission | ${c.perm} |\n` +
                  `| Group | ${c.type} |\n` +
                  `| Aliases | ${c.aliases.join(', ')} |\n\n` +
                  '**Usage**\n\n' +
                  '```php\n' +
                  help +
                  '```\n\n\n'
})
    
output = head + '\n\n---\n\n' + output

fs.writeFile('/var/www/html/files/zbcmds.md', output, (err, res) => {
    if (!err)
        Logger.debug('Successfully created "commands.md"')
})