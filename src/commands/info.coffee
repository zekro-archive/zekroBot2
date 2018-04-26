Main = require '../main'
client = Main.client
Discord = require 'discord.js'
Embeds = require '../util/embeds'
Statics = require '../util/statics'
Cloc = require '../util/cloc'
DL = require '../util/dl'


exports.ex = (msg, args) ->

    deps = Main.package.dependencies
    deps_str = Object.keys deps
        .map (k) -> ":white_small_square:  **#{k}** *(#{deps[k]})*"
        .join '\n'

    memb_count = () ->
        _m = 0
        client.guilds.forEach (g) ->
            _m += g.members.array().length
        return _m

    DL.get_ua 'https://api.github.com/repos/zekrotja/zekroBot2/commits?sha=dev', (c_err, c_res) ->
        if !c_err && c_res
            data = JSON.parse c_res
            commits = data[..5]
                .map((d) -> ":white_small_square: [`#{d.commit.message}`](http://zekro.de/zb2?c=#{d.sha})")
                .join('\n') +
                "\n[**Here**](https://github.com/zekroTJA/zekroBot2/commits/dev) you can get the full list of commits."

        Cloc.getLines (err, res) ->
            client.fetchUser Main.config.hostid
                .then (host) ->
                    emb = new Discord.RichEmbed()
                        .setColor Statics.COLORS.main
                        .setTitle "zekroBot V2 - Info"
                        .setDescription """
                                        This bot is the reworked version of the original [zekroBot](https://github.com/zekroTJA/DiscordBot).
                                        Currently, this bot is in a beta testing, so not all features of the old version are implemented yet.

                                        © 2017 - 2018 zekro Development (Ringo Hoffmann)
                                        """
                        .setImage   'https://zekro.de/src/signaltransmitter_banner.png'
                        .addField   "Current Version", "v.#{Main.VERSION}"
                        .addField   "Stats",
                                    """
                                    ```
                                    Guilds:     #{client.guilds.array().length}
                                    Members:    #{memb_count()}
                                    Commands:   #{Object.keys(Main.cmd.helplist).length}
                                    ```
                                    """

                    if !err and res
                        emb .addField "Lines of Code",
                                    """
                                    **#{res.JavaScript}** lines of JavaScript!
                                    **#{res.CoffeeScript}** lines of CoffeeScript!
                                    **#{res.SQL}** lines of SQL!
                                    **#{res.SUM}** total lines of code!
                                    """
                    
                    if commits
                        emb .addField "Commits (dev branch)",
                                    commits[..1000]

                    emb .addField   "Current Host",
                                    """
                                    ```
                                    #{host.username}##{host.discriminator}
                                    ```
                                    *This user is the user registered in the bot's root config as **host**. So this user has the highest permission level and is responsible for all administration tasks for this bot.*
                                    """
                        .addField   "InviteLink",
                                    """
                                    Get this bot on your own server with the following Link:
                                    :point_right:  **[INVITE](https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=#{Statics.INVPERMS})**
                                    ```
                                    https://discordapp.com/oauth2/authorize?client_id=#{client.user.id}&scope=bot&permissions=#{Statics.INVPERMS}
                                    ```
                                    """
                        .addField   "GitHub Repository", "[**zekroTJA/zekroBot2**](https://github.com/zekroTJA/zekroBot2)"
                        .addField   "Contributors", 
                                    ":white_small_square:  [**zekro**](https://github.com/zekroTJA)"
                        .addField   "Dependencies", deps_str
                        .addField   "Hosted by signaltransmitter", "`AD` | This bot is hosted by [signaltransmitter.de](https://zekro.de/signaltransmitter)"
                    msg.channel.send '', emb
                
