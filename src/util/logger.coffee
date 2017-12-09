Colors = require 'colors'


exports.error = (content) ->
    content.split('\n').forEach (s) ->
        console.log """#{"[ERROR]".red} #{s}"""

exports.info = (content) ->
    content.split('\n').forEach (s) ->
        console.log """#{"[ERROR]".cyan} #{s}"""