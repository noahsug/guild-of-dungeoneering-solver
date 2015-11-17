import task from './lib/task';
import watch from './lib/watch';

// Use this hack until I figure out why webpack isn't automatically picking up
// my changes. Probably related to babel 6 upgrade...
export default task(async function watchTest() {
  async function build() {
    await require('./build')();
  }
  const watcher = await watch(['tools/**/*.js', 'src/**/*.js']);
  watcher.on('changed', build);
  build();
});
