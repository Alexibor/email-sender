const fs = require('fs');

function parseFile(path)
{
    let file = fs.readFileSync(path, 'utf8');

    let subject = file.match(/# .*/, "")[0].replace(/# /, "").trim();
    let body = file.replace(/# .*/, "").trim();
    return { subject, body };
}


module.exports = parseFile;