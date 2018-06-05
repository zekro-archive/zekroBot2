class ArgParser {

    constructor(args) {
        if (typeof args == 'string')
            this.args = [args]
        else
            this.args = args
    }

    static getArg(cont, arg) {
        var regex = new RegExp(`(^|\\s)-${arg}\\s+([^\\s"]+|"[^"]*")`, 'gm')
        var _match = regex.exec(cont)
        var val, match
        if (_match) {
            val = _match[2].replace(/"/g, '').trim()
            match = _match[0]
        }
        return { val, match }
    }

    parse(cont) {
        var out = { vals: {}, rest: null }
        var out_cont = cont
        this.args.forEach(a => {
            let _res = ArgParser.getArg(cont, a)
            out.vals[a] = _res.val
            out_cont = out_cont.replace(_res.match, '')
        })
        out.rest = out_cont 
        return out
    }
}


module.exports = ArgParser