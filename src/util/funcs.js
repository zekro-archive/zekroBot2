

/**
 * Fetch member from guild by identifier.
 * @param   {Discord.Guild}  guild      Guild where to search for member
 * @param   {string}         identifier Identifier - Can be mention, ID, part of nickname or username
 * @param   {boolean}        [bots]     Also search for bots (defaultly: false)
 * @returns {Discord.Member} fetched member
 */
exports.fetchMember = (guild, identifier, bots) => {
    identifier = identifier.toLowerCase()
    

    var methods = [
        (m) => m.id == identifier || m.id == identifier.replace(/[<@!>]/gm, ""),
        (m) => m.user.username.toLowerCase() == identifier,
        (m) => m.user.username.toLowerCase().startsWith(identifier),
        (m) => m.user.username.toLowerCase().includes(identifier),
        (m) => m.displayName.toLowerCase() == identifier,
        (m) => m.displayName.toLowerCase().startsWith(identifier),
        (m) => m.displayName.toLowerCase().includes(identifier)
    ]

    for (var method of methods) {
        let out = guild.members.find(method)
        console.log(method, out)
        if (out && (!out.user.bot || bots))
            return out
    }

    // OLD FETCHING
    // return guild.members.find(m => {
    //     return !m.user.bot && (
    //            m.id == identifier ||
    //            m.id == identifier.replace(/[<@!>]/gm, "") ||
    //            m.user.username.toLowerCase() == identifier ||
    //            m.user.username.toLowerCase().startsWith(identifier) ||
    //            m.user.username.toLowerCase().includes(identifier) ||
    //            m.displayName.toLowerCase() == identifier ||
    //            m.displayName.toLowerCase().startsWith(identifier) ||
    //            m.displayName.toLowerCase().includes(identifier)
    //     )
    // })
}

/**
 * Get date and time as formated string.
 * @param   {boolean} [forFile] Create string with underscores for file name
 * @returns {string}            Formated sate time string
 */
exports.getTime = (forFile) => {
    function btf(inp) {
    	if (inp < 10)
	    return "0" + inp;
    	return inp;
    }
    var date = new Date(),
        y = date.getFullYear(),
        m = btf(date.getMonth() + 1),
	    d = btf(date.getDate()),
	    h = btf(date.getHours()),
	    min = btf(date.getMinutes()),
	    s = btf(date.getSeconds());
    return forFile ? `${y}-${m}-${d}_${h}-${min}-${s}` : `${m}/${d}/${y} - ${h}:${min}:${s}`;
}