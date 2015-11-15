delete require.cache[__filename];
const moduleToRun = process.argv[2];
require('./' + moduleToRun + '.js').default().catch(err => {
  console.error(err.stack)
});
