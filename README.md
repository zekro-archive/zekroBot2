 <div align="center">
     <img src="http://zekro.de/zb2/src/logo_github.png" width="200"/>
     <h1>~ zekroBot v2 ~</h1>
     <strong>A rework of the original zekroBot in node.js</strong><br><br>
 </div>

---

# Intention

The framework and base of the project **[zekroBot](https://github.com/zekrotja/DiscordBot)** was created as I started learning coding in Java, so the project gerew with my experience in coding with Java. Now, more and more bugs come up with some old features and it's also really hard to add new features on that base of the old framework. So I don't want to patch stuff together to get this running again, instead I want to **completely recreate the bot in Node.js**.

I've learned a lot about Node.Js in the last time, so I want to create an easy to handle and maintain framework with an API-Like port to add custom modules by users or co-developers.
Currently, the system is in a very early development phase, so please stay tuned for more updates. ;)

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
$ npm i
```

After that, open up the **`config.json`** file. Enter there your bot account credentials, your User ID to set you as the host of the bot, and the MySql credentials.

Then you should set up your MySql Database for the bot.

### MySql Database Setup

Just login to a web interface like PhpMyAdmin and import the **`zekroBot2.sql`** file you can find in the root directory of the repository, or execute the code in that file.

> Also it is recommendet to create a specific user for the bot to use this database only having permissions accessing this database. Use the following to create such a user:
```sql
GRANT USAGE ON *.* TO 'zekroBot2'@'%' IDENTIFIED BY PASSWORD PASSWORD('USER PASSWORD HERE');

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON `zekroBot2`.* TO 'zekroBot2'@'%';
```

After that, you can start up the bot with
```
$ npm start
```