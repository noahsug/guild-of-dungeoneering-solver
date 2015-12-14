import task from './lib/task';
import watch from './lib/watch';
import shell from 'shelljs';

export default task(async function watchTest() {
  async function test() {
    shell.echo('\n');
    shell.exec('npm test');
  }
  const watcher = await watch(
      ['src/**/*.js', 'jest-setup.js']);
  watcher.on('changed', test);
  test();
});
