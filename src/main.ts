/** @format */

import {
  Client,
  PresenceData,
  Guild,
  Message,
  RichEmbed,
  RichEmbedOptions,
} from 'discord.js';
import winston from 'winston';

const { format, transports } = winston;

function main() {
  const token = process.env.ZB2_DISCORD_TOKEN;
  const dc = new Client();

  const cformat = format.printf(
    ({ timestamp, level, message }): string => {
      return `${timestamp} [${level}] : ${message}`;
    }
  );

  const logger = winston.createLogger({
    level: 'verbose',
    format: format.combine(format.timestamp(), format.colorize(), cformat),
    transports: [new transports.Console()],
  });

  if (!token) {
    logger.error('Discord token not set as environment variable!');
    process.exit(1);
  }

  // -----------------------------
  // --- READY LISTENER
  dc.on('ready', () => {
    logger.info(`Client ready and logged in as ${dc.user.tag} (${dc.user.id})`);

    dc.guilds.forEach((g: Guild) => {
      g.me.setNickname('⚠️ OUT OF SERVICE ⚠️').catch((err) => {
        logger.error(
          `failed setting nick for guild ${g.name} (${g.id}): `,
          err
        );
      });
    });

    dc.user
      .setPresence({
        afk: false,
        game: { name: 'FOR INFO: zb!info' },
        status: 'dnd',
      } as PresenceData)
      .catch((err) => {
        logger.error('Failed setting client presence: ', err);
      });
  });
  // -----------------------------

  // -----------------------------
  // --- MESSAGE LISTENER
  dc.on('message', (msg: Message) => {
    if (msg.author.bot || !msg.content.toLowerCase().startsWith('zb!info')) {
      return;
    }

    msg.channel.send(
      '',
      new RichEmbed({
        color: 0xf7c204,
        author: {
          icon_url:
            'https://images-ext-2.discordapp.net/external/PiVv2AMel4Q8cayM2Nxmpbu98wSPoW9frb2spcRUWgk/https/cdn.discordapp.com/avatars/221905671296253953/a_3a0e52950df41e6fd08a0d41ad8b1999.gif',
          name: 'zekro',
        },
        description:
          "Sorry, but I've decided to drop support for zekroBot2 and so also the host of this instance.\n\n" +
          'Alaternatively, you can use **shinpuru**, my new open source allround Discord Bot which is hosted for free and ' +
          'constantly updated and fixed.\n' +
          ':point_right: [**Here you can invite the bot.**](https://github.com/zekroTJA/shinpuru/wiki/Invite)\n\n' +
          'Of course, you can still self-host zekroBot2 if you really want to. [Here](https://github.com/zekroTJA/zekroBot2/wiki/Instalation---Self-Hosting) ' +
          'you can read about how.\n\n' +
          'Event though, thank you verry much for your support. If you have any questions, ' +
          'feel free to contact me on my [dev discord](https://discord.zekro.de) or directly via DM `zekro#0001`.',
        title: 'zekroBot2 is now out of service',
      } as RichEmbedOptions)
    );
    msg.delete();
  });
  // -----------------------------

  dc.login(token).catch((err) => {
    logger.error('login failed: ', err);
  });
}

// ---------------------------------------------

main();
