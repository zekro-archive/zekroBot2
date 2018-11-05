var Main = require('../main');
var Embeds = require('../util/embeds');
var AcceptMessage = require('acceptmessage');
var Request = require('request');


var TYPES = [
    'CRITICAL',
    'MAJOR',
    'MINOR',
    'SUGGESTION',
    'BUG'
];


module.exports.ex = function(msg, args, author, channel, guild) {

    if (!Main.config.github_access_token) {
        return Embeds.error(channel, 
            'The owner of this bot has not specified a GitHub access token to submit issues with.\n\n' +
            'Surely, you can visit [**zekroBot\'s Issue Page**](https://github.com/zekroTJA/zekroBot2/issues) and submit manually.');
    }

    var createMessageColelctor = () => {
        return channel.createMessageCollector(
            (m) => m.author.id == author.id && m.content.trim().length > 0, 
            { /*maxMatches: 1,*/ time: 15 * 60000 }
        );
    };

    Embeds.default(channel, 'Please enter the **title** of the issue:\n*Enter `exit` or `cancel` to cancel.*');

    var statusCounter = 0;
    var issueBuild = {};

    var messageCollector = createMessageColelctor();

    messageCollector.on('collect', (m) => {
        let cont = m.content;

        if (cont.toLowerCase() == 'close' || cont.toLowerCase() == 'exit') {
            Embeds.error(channel, 'Canceled.');
            messageCollector.stop('canceled');
            return;
        }

        switch (statusCounter) {
            case 0:
                issueBuild.title = cont;
                statusCounter++;
                Embeds.default(channel, 
                    'Please enter now the **labes** of the issue by follwing numbers (multiple lables possible):\n\n' +
                    TYPES.map((t, n) => `\`${n}\` - \`${t}\``).join('\n') +
                    '\n*Enter `exit` or `cancel` to cancel.*');
                break;

            case 1:
                let assignedTypes = [];
                cont.split(/\s|\s*,\s*/gm).forEach((n) => {
                    n = parseInt(n);
                    if (!isNaN(n) && n >= 0 && n < TYPES.length) {
                        assignedTypes.push(TYPES[n]);
                    }
                });
                issueBuild.types = assignedTypes;
                statusCounter++;
                Embeds.default(channel, 
                    'Please enter now a short description to your issue (format in Markdown, in best case with screen shots, error stacks and/or a how-to-repoduce section):\n' +
                    '\n*Enter `exit` or `cancel` to cancel.*');
                break;
            case 2:
                issueBuild.body = cont;
                messageCollector.stop('finished');
                break;
        }
    });

    messageCollector.on('end', (_, reason) => {
        switch (reason) {
            case 'time':
                Embeds.error(channel, 'Issue creation timed out.');
                break;
            case 'finished':
                finalize();
                break;
        }
    });

    function finalize() {

        issueBuild.assembledBody = 
            `## Submitted by\n` +
            `> ${author.user.tag}\n\n` + 
            `## Type(s)\n` +
            `> ${issueBuild.types.length > 0 ? issueBuild.types.join(', ') : 'No tags attached'}\n\n` +
            `## Description:\n` +
            issueBuild.body;

        var accmsg = new AcceptMessage(Main.client, {
            content: Embeds.getEmbed(
                'Your issue will look like following:\n___________________\n\n' +
                'Title: ```\n' + issueBuild.title + '\n```\n' + 
                'Type: ```\n' + issueBuild.types.join(', ') + '\n```\n' +
                'Message: ```\n' + issueBuild.body + '\n```\n' + 
                'Press ✅ to send the report or press ❌ to cancel.'),
            channel: channel,
            checkUser: author,
            emotes: {
                accept: '✅',
                deny:   '❌'
            },
            actions: {
                accept: () => {
                    var options = {
                        uri: `https://api.github.com/repos/zekroTJA/zekroBot2/issues`,
                        method: 'POST',
                        headers: {
                            'Authorization': `token ${Main.config.github_access_token}`,
                            'Content-Type': 'application/json',
                            'User-Agent': 'zekroBot2-BugTracker'
                        },
                        body: JSON.stringify({
                            title:  issueBuild.title,
                            body:   issueBuild.assembledBody,
                            labels: issueBuild.types
                        })
                    };
                    Request(options, (err, res) => {
                        let resdata = JSON.parse(res.body);
                        Embeds.default(channel, `Send. [**Here**](${resdata ? resdata.html_url : ''}) you can see your issue on GitHub.`);
                    });
                },
                deny: () => {
                    Embeds.error(channel, 'Canceled.');
                }
            }
        });
    
        accmsg.send();
    }

 

}
