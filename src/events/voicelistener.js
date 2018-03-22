const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql


client.on('voiceStateUpdate', (mold, mnew) => {
    let guild = mnew.guild
    
    let vold = mold.voiceChannel
    let vnew = mnew.voiceChannel

    // JOINED VOICE CHANNEL
    if (!vold && vnew) {

    }

    // LEFT VOICE CHANNEL
    else if (vold && !vnew) {

    }

    // MOVED TO OTHER CHANNEL
    else if (vold && vnew && vold.id != vnew.id) {
        
    }
})