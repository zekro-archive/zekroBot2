Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Settings = require '../core/settings'
Cloc = require '../util/cloc'


exports.ex = (msg, args) ->
    if args.length < 1
        Embeds.error msg.channel, "Please use `help game` to get information about this command!", "INVALID INPUT"
        return

    out = {}

    Cloc.getLines (err, res) ->
        Settings.getGame (cb_curr) ->
            curr = cb_curr
            switch args[0]
                when 'cloc'
                    if err or !res
                        Embeds.error msg.channel, "An error occured while setting game to cloc output\n```\n#{err}```"
                    else
                        curr.name = "#{res.SUM} lines of code!"
                when 'msg', 'name'
                    if args.length > 1
                        curr.name = args[1..].join(' ') + " | #{Main.config.prefix}help"
                    else
                        Embeds.error msg.channel, "Please enter a valid game name!", "INVALID INPUT"
                        return
                when 'type'
                    validtypes = ['PLAYING', 'WATCHING', 'LISTENING', 'STREAMING']
                    if args.length > 1 and validtypes.indexOf(args[1].toUpperCase()) > -1
                        curr.type = args[1].toUpperCase()
                    else
                        Embeds.error msg.channel, "Please enter a valid game type!", "INVALID INPUT"
                        return
                when 'url'
                    if args.length > 1
                        curr.url = args[1]
                    else
                        Embeds.error msg.channel, "Please enter a valid game url!", "INVALID INPUT"
                        return

            curr.name = if curr.name then curr.name else "zekro.de | #{Main.config.prefix}help"
            curr.type = if curr.type then curr.type else 'PLAYING'
            curr.url = if curr.url then curr.url else "https://twitch.tv/zekrotja"

            client.user.setPresence {
                game: {
                    name: curr.name
                },
                type: curr.type,
                url: curr.url
            }
            # client.user.setActivity curr.name, {url: curr.url, type: curr.type}
            Embeds.default msg.channel, """
                                        Set game to 
                                        ```
                                        Name:    #{curr.name}
                                        Type:    #{curr.type}
                                        URL:     #{curr.url}
                                        ```
                                        """
            Settings.setGame curr, (cb) -> console.log cb