const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const Statics = require('../util/statics')
const YTDL = require('ytdl-core')
const EventEmitter = require('events')
const DL = require('../util/dl')

const TEST_URL = 'https://www.youtube.com/watch?v=H31cS2pDAys'
const PL_TEST_URL = "https://www.youtube.com/playlist?list=PLthqW7GiLEwKYWTl016UnYisBPHUfhmWm"
const PL_TEST_URL_2 = "https://www.youtube.com/watch?v=7QO2Fn-4i8E&index=1&list=PLthqW7GiLEwKYWTl016UnYisBPHUfhmWm&t=0s"

var server = {}

/*
    TODO:
    
    - create kind of event noticing track has ended
        → if queue has further tracks, play them
          else disconnect from voice

    - create now playing messages, displaying in channels
      set in config (?) or in channel, music command 
      was executed

    - create that other commands

    https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist_id}&key=${key}

    PLAYLIST HANDLING → https://stackoverflow.com/questions/41827728/how-to-get-video-ids-from-an-youtube-playlist

*/

class Track extends EventEmitter {
    constructor(member, url) {
        super()
        this.member = member
        this.audio = YTDL(url, {filter: 'audioonly'})
        YTDL.getInfo(url, (err, info) => {
            this.full_info = info
            this.info = {
                length_r: this.full_info.length_seconds,
                length_f: (() => {
                    let l = this.full_info.length_seconds
                    let s = l % 60
                    return `${Math.floor(l / 60)}:${s > 9 ? s : '0' + s}`
                })(),
                title: this.full_info.title,
                author: this.full_info.author.name,
                url: url
            }
            this.emit('info', this.info, this.full_info)
        })
    }
}


/*
    LISTENER HANDLERS
*/

function track_end_handler(guild, conn) {
    server[guild.id].queue.shift()
    if (server[guild.id].queue.length > 0) {
        server[guild.id].dispatcher = play(guild, conn, server[guild.id].queue[0])
    }
    else {
        if (server[guild.id].tchan.topic.startsWith(':musical_note:')) {
            server[guild.id].tchan.setTopic(' ')
        }
        server[guild.id] = null
        conn.disconnect()
    }
}

function track_start_handler(guild, track) {
    let next = server[guild.id].queue[1]
    let chan = server[guild.id].tchan
    let emb = new Discord.RichEmbed()
        .setColor(Statics.COLORS.cyan)
        .setTitle('NOW PLAYING')
        .addField('Current Track', `:arrow_forward:  \`[${track.info.length_f}]\` **${track.info.title}**`)
        .addField('Next Track', next ? `:track_next:  \`[${next.info.length_f}]\` **${next.info.title}**` : ':track_next:  *End of queue*')
    chan.send('', emb)
    
    if (!chan.topic || chan.topic == ' ')
        chan.setTopic(`:musical_note:   [${track.info.length_f}] ${track.info.title}`)
}


/*
    PLAYING FUNCTIONS
*/

function play(guild, conn, track) {
    return conn.playStream(track.audio)
        .on('end', () => {
            track_end_handler(guild, conn)
        })
        .on('start', () => {
            track_start_handler(guild, track)
        })
}

function queue(member, vc, tchan, url, notsendmsg) {

    let conn = member.guild.voiceConnection
    let guild = member.guild

    try {
        var track = new Track(member, url)
    }
    catch (e) {
        return
    }

    if (!server[guild.id])
        server[guild.id] = {queue: []}
    server[guild.id].queue.push(track)
    server[guild.id].tchan = tchan

    var queue = server[guild.id].queue

    if (queue.length == 1) {
        if (conn) {
            server[guild.id].dispatcher = play(guild, conn, queue[0])
        }
        else {
            vc.join().then(conn => {
                console.log('voice connected')
                server[guild.id].dispatcher = play(guild, conn, queue[0])
            }).catch(e => console.log('ERROR', e))
        }
    }

    if (!notsendmsg)
        track.on('info', (info) => {
            let emb = new Discord.RichEmbed()
                .setColor(Statics.COLORS.green)
                .setDescription('Pushed new tack to queue:\n\n' + `\`[${info.length_f}]\` **${info.title}**\n\nTracks in queue: **${server[guild.id].queue.length}**`)
            tchan.send('', emb)
        })
}

function queue_playlist(memb, guild, vc, tchan, url) {
    return new Promise((resolve, reject) => {
        if (!Main.config.youtube_api_key || Main.config.youtube_api_key == '') {
            Embeds.error(tchan, 'No YouTube API key set in bot\'s config.\nYou can only use palylists if the host of this bot added a valid YouTube API link to the config of this bot.', 'MISSING API KEY')
            reject('No API key')
            return
        }
    
        let PLAYLIST_ID = url.split('list=')[1].split('&')[0]
        let API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${Main.config.youtube_api_key}&maxResults=50`
        DL.get_ua(API_URL, (err, res) => {
            if (!err && res) {
                try {
                    let data = JSON.parse(res)
                    let vidurls = data.items.filter(i => i.snippet.thumbnails != null).map(i => i.snippet.resourceId.videoId)
                    let queued = 0
                    vidurls.forEach(vurl => {
                        queued++
                        queue(memb, vc, tchan, `https://youtube.com/watch?v=${vurl}`, true)
                    })
                    let emb = new Discord.RichEmbed()
                        .setColor(Statics.COLORS.green)
                        .setDescription(`Pushed **${queued}** tracks to queue.`)
                    tchan.send('', emb)
                }
                catch (e) {
                    reject(e)
                }
            }
            else {
                reject(err)
            }
        })
    })
}

function pause(member, guild, tchan) {
    let disp = server[guild.id].dispatcher
    if (disp) {
        if (disp.paused)
            server[guild.id].dispatcher.resume()
        else
            server[guild.id].dispatcher.pause()
    }
    let emb = new Discord.RichEmbed()
        .setColor(Statics.COLORS.yellow)
        .setDescription(`${disp.paused ? ':pause_button:' : ':arrow_forward:'}  Player **${disp.paused ? 'paused' : 'resumed'}**.`)
    tchan.send('', emb)
}

function skip(member, guild, tchan, ammount) {

    let queue = server[guild.id].queue
    ammount = ammount ? ammount : 1

    if (ammount > 1) {
        for (i = 1; i < ammount; i++)
            server[guild.id].queue.shif()
    }
    server[guild.id].dispatcher.end()
}

function stop(member, guild) {
    server[guild.id].queue = []
    server[guild.id].dispatcher.end()
}

function shuffle(memb, guild, tchan) {
    var queue = server[guild.id] ? server[guild.id].queue : null
    if (!queue)
        Embeds.error(tchan, 'Queue is empty.')
    else {
        let first = queue[0]
        queue.shift()
        queue = ((array) => {
            let counter = array.length
            while (counter > 0) {
                let index = Math.floor(Math.random() * counter--)
                let temp = array[counter]
                array[counter] = array[index]
                array[index] = temp
            }
            return array
        })(queue)
        queue.unshift(first)
        server[guild.id].queue = queue
        Embeds.default(tchan, ':twisted_rightwards_arrows:  Queue shuffeled', null, Statics.COLORS.deep_orange)
    }
}

function displayqueue(guild, tchan) {

    let queue = server[guild.id] ? server[guild.id].queue : null
    
    let emb = new Discord.RichEmbed()
        .setColor(Statics.COLORS.cyan)
        .setTitle('CURRENT QUEUE')

    if (!queue)
        emb.setDescription('*empty*')
    else if (queue.length == 0)
        emb.setDescription('*empty*')
    else {
        var time = 0, ind = 0
        let squeue = queue.slice(0, 10)
            .map(t => `:white_small_square:  \`${++ind < 10 ? '0' + ind : ind}\` - \`[${t.info.length_f}]\` **${t.info.title}**`)
            .join('\n')

        queue.forEach(t => time += parseInt(t.info.length_r))

        let stime = () => {
            let h = Math.floor(time / 3600)
            let m = Math.floor(time % 3600 / 60)
            let s = time % 3600 % 60
            return `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
        }

        emb.setDescription(`**${queue.length} tracks** - \`[${stime()}]\`\n\n${squeue}`)
    }

    tchan.send('', emb)
}



exports.ex = (msg, args) => {

    // Embeds.error(msg.channel, 'THIS COMMAND DOES NOT WORK CURRENTLY IN ANY WAY.')
    // return

    if (!args[0]) {
        //help()
        return
    }

    let member = msg.member
    let guild = member.guild
    let channel = msg.channel
    let vc = msg.member.voiceChannel

    switch (args[0]) {

        case 'p':
        case 'play':
            if (!args[1]) {
                Embeds.error(channel, 'Please enter a valid video URL to play!', 'ARGUMENT ERROR')
                return
            }
            if (args[1].indexOf('list=') > -1)
                queue_playlist(member, guild, vc, channel, args[1])
            else
                queue(member, vc, channel, args[1])
            break

        case 'pause':
        case 'resume':
            pause(member, guild, channel)
            break

        case 's':
        case 'skip':
            let amm = parseInt(args[1])
            skip(member, guild, channel, (isNaN(amm) || amm < 1) ? null : amm)
            break

        case 'n':
        case 'next':

            break

        case 'pn':
        case 'playnext':

            break

        case 'q':
        case 'queue':
            displayqueue(guild, channel)
            break

        case 'stop':
            stop(member, guild)
            break

        case 'shuffle':
        case 'random':
            shuffle(member, guild, channel)
            break

        case 'dc':
            if (guild.voiceConnection)
                guild.voiceConnection.disconnect()
            break

        case 'test':
            queue(member, vc, channel, TEST_URL)
            break
        
        default:
            Embeds.error(channel, 'Please enter a valid video URL to play!', 'ARGUMENT ERROR')

    }

}