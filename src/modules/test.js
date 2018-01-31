/*

MODULE INFO:
- name:         Test
- version:      1.0
- creator:      zekro (github.com/zekrotja)
- last edited:  2018/01/31

MODULE DESCRIPTION:
Just for testing purposes and as example for other modules.

*/

var Logger = require('../util/logger')


Logger.debug('Loaded test module :)')

exports.test = () => console.log("TEST MODULE TRIGGERED")