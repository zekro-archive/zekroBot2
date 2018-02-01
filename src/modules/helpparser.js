/*

MODULE INFO:
- name:         Help Parser
- version:      1.1
- creator:      zekro (github.com/zekrotja)
- last edited:  2018/02/01

MODULE DESCRIPTION:
This module is just for creating an Markdown formatted file which contains 
various information about commands, which can be implemented into the
main Readme document.

*/


var Main = require('../main')
var fs = require('fs')
var cmds = Main.cmd.helplist
var Logger = require('../util/logger')

var output = ""


Object.keys(cmds).forEach(i => {

        let c = cmds[i]
        let help = c.help.replace(/`/g, '')
        output += `### ${i}\n\n` +
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
    
fs.writeFile('commands.md', output, (err, res) => {
    if (!err)
        Logger.debug('Successfully created "commands.md"')
})