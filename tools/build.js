/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import task from './lib/task';

export default task(async function build() {
  await require('./clean').default();
  await require('./copy').default();
  await require('./bundle').default();
  await require('./render').default();

  async function bob() {
    return 5;
  }
  const z = await bob();
  console.log(z);
});
