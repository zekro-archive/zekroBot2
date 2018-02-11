const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Statics = require('../util/statics')
const Discord = require('discord.js')
const util = require('util');



class BrainFuck {

    constructor(options) {
        this.cell_size =   options && options.cell_size ? options.cell_size : 8
        this.loopbreak =   options && options.loopbreak ? options.loopbreak : 1e9
    }

    increment() {
        let p = this.pointer
        if (this.mem[p])
            if (this.mem[p] < 2 ** this.cell_size - 1)
                this.mem[p]++
            else
                this.mem[p] = 0
        else
            this.mem[p] = 1
    }

    decrement() {
        let p = this.pointer
        if (this.mem[p] && this.mem[p] > 0)
            this.mem[p]--
        else
            this.mem[p] = 2 ** this.cell_size - 1
    }

    shift_forward() {
        this.pointer++
    }

    shift_backward() {
        if (this.pointer != 0)
            this.pointer--
    }

    print() {
        this.out += String.fromCharCode(this.mem[this.pointer])
    }

    input() {
        this.mem[this.pointer] = this.inp_str.charCodeAt(this.inp_pointer) ? 
                                 this.inp_str.charCodeAt(this.inp_pointer) : 
                                 0
    }


    parse_current() {
        switch (this.char) {
            case '>':
                this.shift_forward()
                break
            case '<':
                this.shift_backward()
                break
            case '+':
                this.increment()
                break
            case '-':
                this.decrement()
                break
            case '.':
                this.print()
                break
            case ',':
                this.input()
                break
        }
    }

    setInput(input) {
        this.inp_str = input
        return this
    }

    fancyMemOut() {
        let out = ''
        let _pad = (str, len) => {
            while (str.length < len)
                str = '0' + str
            return str
        }
        this.mem.forEach((v, i) => {
            if (i % 12 == 0)
                out += '\n' + _pad(i.toString(16), 4) + ': '
            out += _pad(v.toString(16), this.cell_size / 4) + ' '
        })
        return out
    }

    compile(code, cb) {
        var stopper = 0
        this.mem = []
        this.pointer = 0
        this.out = ''
        this.inp_pointer = 0

        let len = code.length

        for (let i = 0; i < len; i++) {
            this.char = code.charAt(i)
            if (['>', '<', '+', '-', '.', ','].indexOf(this.char) > -1) {
                this.parse_current(this.char)
            }
            else if (this.char == '[') {
                while (this.mem[this.pointer] > 1) {
                    let start = i
                    do {
                        this.parse_current(this.char)
                        this.char = code.charAt(++i)
                        if (stopper++ > this.loopbreak) {
                            cb('INFINIT_LOOP', this.mem, this.pointer)
                            return
                        }
                    }
                    while (this.char != ']')
                    i = start
                }
            }
        }

        cb(this.out, this.mem, this.pointer)
    }

}



exports.ex = (msg, args) => {
    let chan = msg.channel

    if (args.length < 2 || args.indexOf('-c') == -1) {
        Embeds.invalidInput(chan, 'bf')
        return
    }

    let code = args[args.indexOf('-c') + 1]
    let cell_size = args.indexOf('-b') > -1 ? args[args.indexOf('-b') + 1] : 8
    let verbose = args.indexOf('-v') > -1
    let loopbreak = 1e9

    var bf = new BrainFuck({cell_size, loopbreak})

    let ind = args.indexOf('-i') > -1
    if (ind > -1)
        bf.setInput(args.slice(ind + 1).join(' ').match(/"(\n|.)*"/gm))

    bf.compile(code, (out, mem, pointer) => {
        if (out == 'INFINIT_LOOP') {
            Embeds.error(chan, `The compiler run into an inifinit loop and broke after executing ${loopbreak} loops.`, 'BRAINFUCK ERROR')
            return
        }
        chan.send('', new Discord.RichEmbed()
            .setColor(Statics.COLORS.main)
            .setTitle('Brainfuck compiled')
            .setDescription(
                `Used memory: \`${mem.length * cell_size / 8}\` bytes\n\n` +
                'Executed code:\n```brainfuck\n' +
                code.substr(0, 1000) +
                '\n```' +
                '\n\n**Output:**\n```' +
                (out ? out : '<no output>') +
                '\n```' +
                (verbose ? `\n\n**Memory: **\`\`\`${bf.fancyMemOut().substr(0, 1000)}\`\`\`` : '')
            )
        )
    })
}