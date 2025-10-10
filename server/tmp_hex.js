const fs = require('fs');
require('dotenv').config();
const s = process.env.DATABASE_URL || '';
console.log('LEN', s.length);
let hex = [];
for (let i=0;i<Math.min(s.length,200);i++) hex.push(s.charCodeAt(i).toString(16).padStart(2,'0'));
console.log(hex.join(' '));
console.log('STRING:', s);
try{ console.log('URL_PARSE_OK? ', new URL(s).hostname);}catch(e){ console.error('URL_ERR', e.message);}