delete require.cache[__filename];
const module = process.argv[2];
require('./' + module + '.js')().catch(err => console.error(err.stack));
