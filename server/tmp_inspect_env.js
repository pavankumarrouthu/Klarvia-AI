const fs = require('fs');
try {
  const s = fs.readFileSync('.env', 'utf8');
  console.log('RAW_ENV_JSON:', JSON.stringify(s));
  console.log('--- lines ---');
  s.split(/\r?\n/).forEach((l, i) => console.log(i+1, JSON.stringify(l)));
} catch (e) {
  console.error('ERR', e && e.message);
  process.exit(1);
}
