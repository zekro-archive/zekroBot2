const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')
const Discord = require('discord.js')
const util = require('util');
const request = require('request');

const APIURL = 'https://api.github.com';


function setup(chan, member, guild, msg) {
    if (Main.cmd.getPermLvl(member) < 4) {
        return Embeds.error(chan, 'You dont have the permission to do that. Permission level `4` required.');
    }

    let memberFilter = (_m) => _m.author.id == member.id;

    let tokenText = 'First, I need a valid GitHub API token to invite users to your organization.\n' + 
        'To do so, log in to GitHub and go to [Developer Settings → Personal access tokens](https://github.com/settings/tokens). ' + 
        'The token needs the permission `admin:org` to send invites for your organization.\n\n' + 
        'Please enter your token here ***(You should delete this message after manually!)***:';

    Embeds.default(member, tokenText).then((m) => {
        msg.delete();
        let collector = m.channel.createMessageCollector(memberFilter, { time: 10 * 60000, maxMatches: 1 });
        collector.on('collect', (m) => {
            var token = m.content;
            m.channel.send('', new Discord.RichEmbed().setDescription('Validating token...')).then((m) => {
                let opts = {
                    uri:    APIURL + '/user/orgs',
                    method: 'GET',
                    headers: {
                        'Authorization': 'token ' + token,
                        'User-Agent': 'zekroBot2'
                    }
                };

                request(opts, (err, res) => {
                    let body = JSON.parse(res.body);
                    if (err) {
                        m.edit('', new Discord.RichEmbed()
                            .setDescription('Unknown error while requesting: ```\n' + err + '\n```')
                            .setColor(Statics.COLORS.red));
                    } else if (body.message == 'Bad credentials') {
                        m.edit('', new Discord.RichEmbed()
                            .setDescription('Entered token is invalid.')
                            .setColor(Statics.COLORS.red));
                    } else if (body.length < 1) {
                        m.edit('', new Discord.RichEmbed()
                            .setDescription('No organizations found for this account.')
                            .setColor(Statics.COLORS.red));
                    } else {
                        let orgnames = body.map((o) => o.login.toLowerCase());
                        let orgsstr = body.map((o) => '- `' + o.login + '`').join('\n');
                        m.edit('', new Discord.RichEmbed()
                            .setDescription('Token is valid.\n\n' + 
                                'Found following organizatiosn for your account:\n' + 
                                orgsstr + '\n\n' + 
                                'Please enter the name of the guild you want to set for inviting using the command *(not case sensitive)*:')
                            .setColor(Statics.COLORS.main));
                        let collector = m.channel.createMessageCollector(memberFilter, { time: 1 * 60000})
                        collector.on('collect', (m) => {
                            var orgname = m.content;
                            if (orgnames.includes(orgname.toLowerCase())) {
                                Embeds.default(m.channel, 'Successfully registered invite to organization `' + orgname + '`.\n\n' + 
                                    'Enter `zb:orgs setup` to change your settings or `zb:orgs remove` to reset settings and delete credentials.');
                                let ghorgcred = token + '|' + orgname;
                                Mysql.query(`INSERT OR IGNORE INTO guilds (guild, ghorg) VALUES ('${guild.id}', '${ghorgcred}')`, () => {
                                    Mysql.query(`UPDATE guilds SET ghorg = '${ghorgcred}' WHERE guild = '${guild.id}'`);
                                });
                            } else {
                                Embeds.error(m.channel, 'Invalid organization name. Try again:');
                            }
                        });
                    }
                });
            });
        });
    }).catch((e) => {
        Embeds.error(chan, 'Failed sending DM. Do you have server DMs enabled in your Discord settings?');
    });
}

function invite(chan, member, guild, msg, ghname) {
    ghname = ghname.replace(/(https?:\/\/)?(www\.)?github\.com\//gim, '');

    Mysql.query(`SELECT ghorg FROM guilds WHERE guild = ${guild.id}`, (err, res) => {
        if (err) {
            return Embeds.error(chan, 'There was an unexpexted error getting data from database: ```\n' + err + '\n```');
        }
        if (!res || res.length < 1 || !res[0].ghorg || res[0].ghorg.length < 1) {
            return Embeds.error(chan, 'No organisation was set for invitation.');
        }

        let ghsplit = res[0].ghorg.split('|');
        let token = ghsplit[0];
        let orgname = ghsplit[1];

        let opts = {
            uri:    `${APIURL}/orgs/${orgname}/memberships/${ghname}`, // `https://api.github.com/orgs/Dark-Devs/memberships/${username}`,
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + token,
                'User-Agent': 'zekroTJA'
            }
        };

        request(opts, (err, res) => {
            let body = JSON.parse(res.body);
            if (body.message == 'Not Found') {
                Embeds.error(chan, `There is no GitHub user with the username \`${ghname}\`.`);
            } else {
                Embeds.default(chan, 'Invite was send.\nPlease look into your emails or navigate to ' + 
                    `the [invite page](https://github.com/orgs/${orgname}/invitation) to accept the invite.`);
            }
        });
    });
}

function remove(chan, member, guild) {
    if (Main.cmd.getPermLvl(member) < 4) {
        return Embeds.error(chan, 'You dont have the permission to do that. Permission level `4` required.');
    }

    Mysql.query(`UPDATE guilds SET ghorg = '' WHERE guild = ${guild.id}`, (err) => {
        if (err) {
            return Embeds.error(chan, 'There was an unexpexted error getting data from database: ```\n' + err + '\n```');
        }
        return Embeds.default(chan, 'Removed all settings and credentials for this command from the database.');
    });
}


exports.ex = (msg, args) => {
    var member = msg.member
    var guild = member.guild
    var chan = msg.channel

    if (!args[0]) {
        return Embeds.invalidInput('orga');
    }

    switch (args[0]) {

        case 'setup':
        case 'create':
            return setup(chan, member, guild, msg);

        case 'remove':
        case 'delete':
        case 'purge':
            return remove(chan, member, guild);

        default:
            return invite(chan, member, guild, msg, args[0]);
    }
}