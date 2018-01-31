Colors = require 'colors'
Main = require '../main'


exports.error = (content) ->
    content.split('\n').forEach (s) ->
        console.log """#{"[ERROR]".red} #{s}"""

exports.info = (content) ->
    content.split('\n').forEach (s) ->
        console.log """#{"[INFO]".cyan} #{s}"""

exports.debug = (content) ->
    if Main.argv.indexOf('-d') > -1 or Main.argv.indexOf('--debug') > -1
        content.split('\n').forEach (s) ->
            console.log """#{"[DEBUG]".yellow} #{s}"""