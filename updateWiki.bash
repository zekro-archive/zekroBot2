#!/bin/bash

# This file is only for updating the commands list documentation in the
# zekroBot wiki, which is automatically created from modules/helpparser.js

git clone git@github.com:zekroTJA/zekroBot2.wiki.git
cd zekroBot2.wiki
cp /var/www/html/files/zbcmds.md Commands.md
git add .
git commit -m "automatically updated commands page"
git push origin master
cd ..
rm -r zekroBot2.wiki --force

echo "Successfully updated wiki page"