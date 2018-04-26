const { client } = require('../main')


exports.msgs = 0

client.on('message', () => exports.msgs++)

