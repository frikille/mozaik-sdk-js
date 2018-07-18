const fs = require('fs');

const pkg = require('../package.json');

delete pkg.scripts;
delete pkg.devDependencies;

fs.writeFileSync('./lib/package.json', JSON.stringify(pkg, null, 2));
