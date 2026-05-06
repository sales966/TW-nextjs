const fs = require('fs');
const path = require('path');

function walk(d) {
  let results = [];
  fs.readdirSync(d).forEach(f => {
    f = path.join(d, f);
    if (fs.statSync(f).isDirectory()) {
      results = results.concat(walk(f));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      results.push(f);
    }
  });
  return results;
}

const files = walk('C:/Users/tomor/Documents/003/src');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // replace \` with `
  let n = c.replace(/\\`/g, '`');
  // replace \$ with $
  n = n.replace(/\\\$/g, '$');
  
  if (c !== n) {
    fs.writeFileSync(f, n);
    console.log('Fixed', f);
  }
});
