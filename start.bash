#!bin/bash

# OPTIONS
SCREENNAME="zekroBot"

# COLORS
R="\033[0;31m" 
C="\033[0;36m" 
W="\033[0;37m" 
Y="\033[0;33m"

# CONSTANTS
ERROR="$R[ ERROR ]$W "
INFO="$C[ INFO ]$W "
WARNING="$Y[ WARNING ]$W "

# VARS
git=true
screen=true
debug='start'


# Check present installations of required tools
{
    # checking for node installation
    if ! type node >/dev/null 2>&1
    then
        echo -e $ERROR "Command 'node' is not available on this system"
        exit -1
    fi

    # checking for npm installation
    if ! type npm >/dev/null 2>&1
    then
        echo -e $ERROR "Command 'npm' is not available on this system"
        exit -1
    fi

    # check for screen installation
    if ! type screen >/dev/null 2>&1
    then
        screen=false
        echo -e $WARNING "'screen' is not installed! It's recommended to install screen to run this bot as server starting over ssh."
    fi

    # checkig for git installation
    if ! type git >/dev/null 2>&1
    then
        git=false
        echo -e $WARNING "Command 'git' is not available on this system"
        echo -e $WARNING "Can not automatically update repository."
    fi
}

# Argument checking
{
    # Help msg
    if [ $1 = '--help' ] || [ $1 = '-h' ]; then
        echo ""
        echo "Start and setup script for zekroBot2."
        echo "(C) 2018-present Ringo Hoffmann (zekro Development)"
        echo ""
        echo "  -s   Stop running bot screen"
        echo "  -r   Resume running screen session"
        echo "  -d   Enable debug output of bot"
        echo "  -c   Clear 'node_modules' and 'config.json'"
        echo ""
        exit 0
    fi

    # Debug mode
    if [ $1 = '-d' ]; then
        debug='test'
    fi

    # Stop screen
    if [ $1 = '-s' ]; then
        if ! $screen; then
            echo -e $ERROR "'screen' is not installed."
        elif ! [[ `screen -ls` = *"$SCREENNAME"* ]]; then
            echo -e $ERROR "zekroBot screen is currently not running."
        else
            screen -X -S $SCREENNAME quit
            echo -e $INFO "zekroBot screen stopped."
        fi
        exit 0
    fi

    # Clear
    if [ $1 = '-c' ]; then
        echo -e $WARNING "THIS DELETES 'node_modules' and 'config.json'! Do you really want to continue?"
        answer='__'
        while [ ! $answer = 'n' ] && [ ! $answer = 'y' ]; do
            read -p "[y/n] " answer
        done
        if [ $answer = 'y' ]; then
            rm -r node_modules
            rm _run_script config.json
            echo -e $INFO "Cleaned 'node_modules' and 'config.json'"
        else
            echo -e $INFO "Canceled."
        fi
        exit 0
    fi

    # Resume 
    if [ $1 = '-r' ]; then
        if ! $screen; then
            echo -e $ERROR "'screen' is not installed."
        elif ! [[ `screen -ls` = *"$SCREENNAME"* ]]; then
            echo -e $ERROR "zekroBot screen is currently not running."
        else
            screen -r $SCREENNAME
        fi
        exit 0
    fi

}

# checking if repo is installed, if not, install from git repo and install dependencies
if ! [ -d .git ]
then
    
    if ! $git; then
        echo -e $ERROR "Can not auotmatically clone from github because git is not installed!"
        exit -1
    else
        echo -e $INFO "Installing repository from github.com/zekrotja/zekroBot2..."
        git init
        git remote add origin https://github.com/zekroTJA/zekroBot2.git
        git pull origin dev
        echo -e $INFO "Changing branch to 'dev'..."
        git checkout dev
        echo -e $INFO "Installing npm packages..."
        npm install

        rm src/modules/helpparser.js

        echo -e $INFO "Staring bot to generate config..."
        npm start
        if [ -f /bin/nano ]; then
            nano config.json
            echo -e $INFO "Setup finished! Now you can restart the script to start the bot."
        elif [ -f /usr/bin/vim ]; then
            vim config.json
            echo -e $INFO "Setup finished! Now you can restart the script to start the bot."
        else
            echo -e $INFO "Please open the generated file 'config.json' with a text editor and enter your preferences."
        fi
    fi

else
    
    echo -e $INFO "Checking for updates..."
    git checkout dev
    git pull origin dev
    if ! [ -d node_modules ]; then
        echo -e $INFO "Node modules not installed. Executing 'npm install'..."
        npm install
    fi

    if ! [ -f config.json ]; then
        echo -e $INFO "Staring bot to generate config..."
        npm start
        if [ -f /bin/nano ]; then
            nano config.json
            echo -e $INFO "Setup finished! Now you can restart the script to start the bot."
        elif [ -f /usr/bin/vim ]; then
            vim config.json
            echo -e $INFO "Setup finished! Now you can restart the script to start the bot."
        else
            echo -e $INFO "Please open the generated file 'config.json' with a text editor and enter your preferences."
        fi
        exit
    fi

    if ! $screen; then
        echo -e $WARNING "'screen' is not installed and bot wil lstart in current session!"
        echo -e $WARNING "'This means, that the bot will stop running after exiting this terminal session!"
        read -p "[ Press any key to continue... ]"
        while true; do
            npm $debug
            echo -e $WARNING "Bot crashed and will automatically restart."
            echo -e $INFO "Stop restart loop with CTRL + C (maybe multiple times)"
        done
    else
        if ! [ -f _run_script ]; then
            echo -e $INFO "Generating loop script..."
            echo "#!/bin/bash
# This is an automatically generated file by start script.

while true; do
    npm \$1
    echo -e \"$WARNING\" \"Bot crashed and will automatically restart.\"
    echo -e \"$INFO\" \"Stop restart loop with CTRL + C (maybe multiple times)\"
done" >> _run_script
        fi
        screen -L -S $SCREENNAME bash _run_script $debug
    fi
fi