const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const Logger = require('../util/logger')
const Statics = require('../util/statics')
const YTDL = require('ytdl-core')

const TEST_URL = 'https://www.youtube.com/watch?v=H31cS2pDAys'

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

    PLAYLIST HANDLING → https://stackoverflow.com/questions/41827728/how-to-get-video-ids-from-an-youtube-playlist

*/

class Track {
    constructor(member, url) {
        this.member = member
        this.audio = YTDL(url, {filter: 'audioonly'})
        YTDL.getInfo(url, (err, info) => {
            this.full_info = info
            this.info = {
                length: this.full_info.length_seconds,
                title: this.full_info.title,
                author: this.full_info.author.name,
                url: url
            }
        })
    }
}


function play(guild, conn, track) {
    return conn.playStream(track.audio)
        .on('end', () => {
            console.log('track ended')
            server[guild.id].queue.shift()
            if (server[guild.id].queue.length > 0) {
                server[guild.id].dispatcher = play(guild, conn, server[guild.id].queue[0])
            }
            else
                conn.disconnect()
        })
}

function queue(member, vc, url) {

    let conn = member.guild.voiceConnection
    let guild = member.guild

    if (!server[guild.id])
        server[guild.id] = {queue: []}
    server[guild.id].queue.push(new Track(member, url))

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
            queue(member, vc, args[1])
            break;

        case 'pause':
        case 'resume':

            break;

        case 's':
        case 'skip':
        
            break;

        case 'n':
        case 'next':

            break;

        case 'pn':
        case 'playnext':

            break;

        case 'q':
        case 'queue':
        
            break;

        case 'dc':
            if (guild.voiceConnection)
                guild.voiceConnection.disconnect()
            break

        default:
            //help()

    }

}