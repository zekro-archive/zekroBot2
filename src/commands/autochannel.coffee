Main = require '../main'
Mysql = Main.mysql
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
ACHandler = require '../core/autochanhandler'
Settings = require '../core/settings'



exports.ex = (msg, args) ->
    chan = msg.channel
    guild = msg.guild
    vchans = guild.channels.filter (c) -> c.type == 'voice'

    if args.length < 1
        Embeds.invalidInput chan, 'autochannel'
        return

    _getchan = (inpt) ->
        return vchans.find (c) -> c.id == inpt or c.name.toLowerCase().indexOf(inpt.toLowerCase()) > -1
    
    _getbyid = (id) ->
        return vchans.find (c) -> c.id == id
    
    query = args[1..].join(' ')

    switch args[0]

        when 'pre', 'prefix'
            if args.length < 2
                Embeds.invalidInput chan, 'autochannel'
                return
            if args[1] == 'off'
                Mysql.query "UPDATE guilds SET autochanprefix = '' WHERE guild = '#{guild.id}'"
                Embeds.default chan, 'Reset autochannel prefix.'
            else
                Mysql.query "UPDATE guilds SET autochanprefix = '#{args[1]}' WHERE guild = '#{guild.id}'", (err, res) ->
                    if !err and res
                        if res.affectedRows == 0
                            Mysql.query "INSERT INTO guilds (guild, autochanprefix) VALUES ('#{guild.id}', '#{args[1]}')"
                Embeds.default chan, "Set autochannel prefix to `#{args[1]}`.\n*You can reset with with `autochannel prefix off`.*"
        when 'add', 'set', 'create'
            if args.length < 2
                Embeds.invalidInput chan, 'autochannel'
                return
            vchan = _getchan query
            if !vchan
                Embeds.error chan, "Can not fetch any voice channel to the input ```#{query}```"
            else
                Settings.getAutochanPre guild, (pre) ->
                    console.log pre
                    if (pre)
                        vchan.setName "#{pre} #{chan.name}"
                Mysql.query "SELECT * FROM autochans WHERE chan = '#{vchan.id}'", (err, res) ->
                    if !err and res
                        if res.length > 0
                            Embeds.error chan, "The channel `#{vchan.name}` is still set as auto channel.\n*Unset it with `autochannel usnet <channel>`*"
                        else
                            Mysql.query "INSERT INTO autochans (chan, guild) VALUES ('#{vchan.id}', '#{guild.id}')", (err, res) ->
                                if !err and res
                                    ACHandler.set vchan, guild
                                    Embeds.default chan, "Set channel `#{vchan.name}` as autochannel."
                                else
                                    Embeds.error chan, "An unexpected error occured while editing database: ```#{err}```"

        when 'unset', 'remove', 'delete'
            if args.length < 2
                Embeds.invalidInput chan, 'autochannel'
                return
            vchan = _getchan query
            if !vchan
                Embeds.error chan, "Can not fetch any voice channel to the input ```#{query}```"
            else
                Settings.getAutochanPre guild, (pre) ->
                    if (pre)
                        vchan.setName vchan.name.split(' ')[1..].join(' ')
                Mysql.query "SELECT * FROM autochans WHERE chan = '#{vchan.id}'", (err, res) ->
                    if !err and res
                        if res.length == 0
                            Embeds.error chan, "The channel `#{vchan.name}` Is not set as autochannel.\n*Set it with `autochannel set <channel>`*"
                        else
                            Mysql.query "DELETE FROM autochans WHERE chan = '#{vchan.id}'", (err, res) ->
                                if !err and res
                                    ACHandler.unset vchan, guild
                                    Embeds.default chan, "Unset channel `#{vchan.name}`."
                                else
                                    Embeds.error chan, "An unexpected error occured while editing database: ```#{err}```"

        when 'list', 'display', 'all'
            out = ACHandler.get(guild).map((c) -> ":white_small_square:  #{_getbyid(c).name}").join('\n')
            console.log ACHandler.get(guild)
            Embeds.default chan, out, 'Autochannels for this guild'