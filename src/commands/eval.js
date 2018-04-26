const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')
const Discord = require('discord.js')
const util = require('util');

exports.ex = (msg, args) => {

    let guild = msg.member.guild;
    let channel = msg.channel;

    if (args.length == 0) {
        Embeds.error(channel, "Enter `help eval` to get help about this command.", "INVALID INPUT")
        return;
    }
    
    if (args.indexOf('objects') > -1) {
        Embeds.default(channel, 
            "Available objects:\n\n" +
            "**Bot Classes**\n" +
            "- [Main](https://github.com/zekroTJA/zekroBot2/blob/master/src/main.js)\n" +
            "- [Mysql *(instance)*](https://github.com/zekroTJA/zekroBot2/blob/master/src/core/mysql.js)\n" +
            "- [Embeds](https://github.com/zekroTJA/zekroBot2/blob/master/src/util/embeds.coffee)\n" +
            "- [Statics](https://github.com/zekroTJA/zekroBot2/blob/master/src/util/statics.coffee)\n\n" +
            "**discord.js Objects**\n" +
            "- Discord *(discord.js)*\n" +
            "- [client *(Client instance)*](https://discord.js.org/#/docs/main/stable/class/Client)\n" +
            "- [guild *(Guild instance)*](https://discord.js.org/#/docs/main/stable/class/Guild)\n" +
            "- [channel *(TextChannel instance)*](https://discord.js.org/#/docs/main/stable/class/TextChannel)\n" +
            "- [msg *(Message instance)*](https://discord.js.org/#/docs/main/stable/class/Message)\n" +
            "- args *(String[])*\n" +
            "\n*Hint: Use `util.inspect(value)` if you want to display object-type / non-string values.*"
        )
        return
    }

    let cmd = args.join(' ');
    let res;
    let success = true;
    try {
        res = eval(cmd);
        if (typeof res !== 'string')
            res = util.inspect(res);
    }
    catch (e) {
        success = false;
        res = e;
    }

    channel.send('', new Discord.RichEmbed()
        .setColor(success ? 0x76FF03 : 0xd50000)
        .setTitle(success ? "Eval Output" : "Eval Error")
        .setDescription(
            'for command:' +
            `\`\`\`js\n${cmd}\`\`\`` +
            'output:\n' + 
            `\`\`\`\n${res.length != 0 ? res.substr(0, 2000) : "no eval output"}\n\`\`\``
        )
    )

}