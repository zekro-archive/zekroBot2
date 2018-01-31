 <div align="center">
     <img src="http://zekro.de/zb2/src/logo_github.png" width="200"/>
     <h1>~ zekroBot v2 ~</h1>
     <strong>A rework of the original zekroBot in node.js</strong><br><br>
 </div>

---


If you want to reuse the code of this project, please read **[this](http://s.zekro.de/codepolicy)** before doing so!

Have some questions or want to join my developer community discord? Take a look! :^)
<br/><a href="http://discord.zekro.de"><img src="https://discordapp.com/api/guilds/307084334198816769/embed.png"/></a>

----

# Intention

The framework and base of the project **[zekroBot](https://github.com/zekrotja/DiscordBot)** was created as I started learning coding in Java, so the project gerew with my experience in coding with Java. Now, more and more bugs come up with some old features and it's also really hard to add new features on that base of the old framework. So I don't want to patch stuff together to get this running again, instead I want to **completely recreate the bot in Node.js**.

I've learned a lot about Node.Js in the last time, so I want to create an easy to handle and maintain framework with an API-Like port to add custom modules by users or co-developers.
Currently, the system is in a very early development phase, so please stay tuned for more updates. ;)

---

# Get It!

[![Uptime Robot status](https://img.shields.io/uptimerobot/status/m779430970-e7fbeac99e0f5b24c277880c.svg)](https://stats.uptimerobot.com/WPBJjHp26) &nbsp;
[![Uptime Robot ratio](https://img.shields.io/uptimerobot/ratio/m779430970-e7fbeac99e0f5b24c277880c.svg)](https://stats.uptimerobot.com/WPBJjHp26)

<a href="https://discordapp.com/oauth2/authorize?client_id=388848585879584778&scope=bot&permissions=2146958455"><img src="https://github.com/zekroTJA/DiscordBot/blob/master/.websrc/add_to_discord.png?raw=true" width="300"/></a>

---

# Installation

### Requirements

- Node.js >= v. 3.6
- MySql Database Server

### Step-By-Step Installation

Just clone the project somewhere on your system

```
$ git clone https://github.com/zekrotja/zekroBot2
```
*If you have forked the project you need your own username and repository name obviously instead of `/zekrotja/zekroBot2`.*

Then, you need to install all npm-packages
```
$ npm install
```

After that, open up the **`config.json`** file. Enter there your bot account credentials, your User ID to set you as the host of the bot, and the MySql credentials.

Then you should set up your MySql Database for the bot.

### MySql Database Setup

Just login to a web interface like PhpMyAdmin and import the [**`zekroBot2.sql`**](https://github.com/zekroTJA/zekroBot2/blob/master/zekroBot2.sql) file you can find in the root directory of the repository, or execute the code in that file.

> Also it is recommendet to create a specific user for the bot to use this database only having permissions accessing this database. Use the following to create such a user:
```sql
GRANT USAGE ON *.* TO 'zekroBot2'@'%' IDENTIFIED BY PASSWORD PASSWORD('USER PASSWORD HERE');

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON `zekroBot2`.* TO 'zekroBot2'@'%';
```

After that, you can start the bot with
```
$ npm start
```

---

# Commands & Functions

### autochannel

> Manage automatic voice channels

| | |
| --------- | --------- |
| Permission | 3 |
| Group | GUILDADMIN |
| Aliases | - autochan</br>- ac</br>- autochans |

**Usage**

```php
zb:autochannel set <channel>
zb:autochannel unset <channel>
zb:autochannel list
```


### broadcast

> Send messages to all servers or server owners

| | |
| --------- | --------- |
| Permission | 999 |
| Group | ADMIN |
| Aliases | - bcast</br>- bc |

**Usage**

```php
zb:broadcast owners <msg>
zb:broadcast all <msg>
```


### id

> Get elements by ID or IDs of elements

| | |
| --------- | --------- |
| Permission | 0 |
| Group | MISC |
| Aliases | - whois</br>- whatis</br>- identify |

**Usage**

```php
zb:id <ID>
zb:id <name>
```


### restart

> Restart the bot

| | |
| --------- | --------- |
| Permission | 100 |
| Group | ADMIN |
| Aliases |  |

**Usage**

```php
zb:restart
```


### mvall

> Move all members in current channel to another

| | |
| --------- | --------- |
| Permission | 2 |
| Group | MODERATION |
| Aliases | - moveall</br>- mv |

**Usage**

```php
zb:mvall <channel>
```


### guild

> Get information about guild

| | |
| --------- | --------- |
| Permission | 0 |
| Group | MISC |
| Aliases | - guildstats</br>- server |

**Usage**

```php
zb:guild
```


### vote

> Create a vote

| | |
| --------- | --------- |
| Permission | 0 |
| Group | CHAT |
| Aliases | - poll |

**Usage**

```php
zb:vote <title> | <answer 1> | <answer 2> | <...>
zb:vote close
```


### quote

> Quote a message of any channel in the guild

| | |
| --------- | --------- |
| Permission | 0 |
| Group | CHAT |
| Aliases | - q |

**Usage**

```php
zb:user <messageID>
```


### user

> Get information about user on guild

| | |
| --------- | --------- |
| Permission | 0 |
| Group | MISC |
| Aliases | - member</br>- userinfo</br>- uinfo</br>- profile |

**Usage**

```php
zb:user <user>
zb:user
```


### autorole

> Set the role users will automatically get after joining the guild

| | |
| --------- | --------- |
| Permission | 5 |
| Group | GUILDADMIN |
| Aliases | - guildrole</br>- joinrole |

**Usage**

```php
zb:autorole <role>
zb:autorole reset
```


### info

> Get info about the bot

| | |
| --------- | --------- |
| Permission | 0 |
| Group | MISC |
| Aliases | - about |

**Usage**

```php
zb:info
```


### test

> Just for testing purposes

| | |
| --------- | --------- |
| Permission | 999 |
| Group | DEBUG |
| Aliases |  |

**Usage**

```php
no help
```


### perms

> Set the permission levels for specific roles

| | |
| --------- | --------- |
| Permission | 5 |
| Group | SETTING |
| Aliases | - permroles</br>- perm</br>- permlvl |

**Usage**

```php
zb:perms <LVL>, <role1>, <role2>, ...
zb:perms list
zb:perms reset <lvl>
```


### game

> Set messages the bot should show in playing text

| | |
| --------- | --------- |
| Permission | 999 |
| Group | SETTING |
| Aliases | - playing</br>- botmsg |

**Usage**

```php
zb:game msg <message 1>, <message 2>, ...
zb:game type <playing, streaming, listening, watching>
zb:game url <twitch url>
zb:game reset
```


### say

> Send an embed message with the bot

| | |
| --------- | --------- |
| Permission | 2 |
| Group | CHAT |
| Aliases | - saymsg |

**Usage**

```php
zb:say <message>
zb:say -e <message>
zb:say -e:<color> <message>
zb:say colors
```


### eval

> evaluate code with this command

| | |
| --------- | --------- |
| Permission | 999 |
| Group | ADMIN |
| Aliases | - evaluate</br>- exec |

**Usage**

```php
zb:eval <js code>
zb:eval objects
```


### prefix

> Register a guild specific prefix

| | |
| --------- | --------- |
| Permission | 5 |
| Group | GUILDADMIN |
| Aliases | - pre</br>- guildpre</br>- guildprefix |

**Usage**

```php
zb:prefix <new prefix>
zb:prefix
```


### clear

> Clear an ammount of messages in a chat

| | |
| --------- | --------- |
| Permission | 4 |
| Group | MODERATION |
| Aliases | - purge</br>- clean |

**Usage**

```php
zb:clear <ammount>
zb:clear <ammount> <user>
zb:prefix
```


