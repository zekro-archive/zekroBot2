const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql


client.on('channelDelete', (chan) => {
    Mysql.query(`DELETE FROM chanlinks WHERE tchan = '${chan.id}' OR vchan = '${chan.id}'`)
})

client.on('voiceStateUpdate', (mold, mnew) => {
    let guild = mnew.guild
    
    let vold = mold.voiceChannel
    let vnew = mnew.voiceChannel

    Mysql.query(`SELECT * FROM chanlinks WHERE vchan = '${vnew ? vnew.id : 0}' OR vchan = '${vold ? vold.id : 0}'`, (err, res) => {
        if (!err && res) {
            res.forEach(r => {
                let tchan = guild.channels.find(c => c.id == r.tchan)
                if (tchan) {
                    // JOINED VOICE CHANNEL
                    if (!vold && vnew) {
                        tchan.overwritePermissions(mnew, {
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: false
                        })
                    }
                
                    // LEFT VOICE CHANNEL
                    else if (vold && !vnew) {
                        tchan.overwritePermissions(mnew, {
                            VIEW_CHANNEL: false,
                            READ_MESSAGE_HISTORY: false
                        })
                    }
                
                    // MOVED TO OTHER CHANNEL
                    else if (vold && vnew && vold.id != vnew.id) {
                        let vchan = guild.channels.find(c => c.id == r.vchan)
                        if (vchan && vnew.id == vchan.id) {
                            tchan.overwritePermissions(mnew, {
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: false
                            })
                        }
                        else if (vchan && vold.id == vchan) {
                            tchan.overwritePermissions(mnew, {
                                VIEW_CHANNEL: false,
                                READ_MESSAGE_HISTORY: false
                            })
                        }
                    }
                }
            })
        }
    })

    
})