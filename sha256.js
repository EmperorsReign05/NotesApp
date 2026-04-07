const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('EmperorsReign05').digest('hex');
const fs = require('fs');
fs.writeFileSync('hash.txt', hash);
console.log(hash);
