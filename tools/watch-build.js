import task from './lib/task';
import watch from './lib/watch';

export default task(async function watchTest() {
  async function build() {
    await require('./build')();
  }
  const watcher = await watch(['tools/**/*.js', 'src/**/*.js']);
  watcher.on('changed', build);
  build();
});
