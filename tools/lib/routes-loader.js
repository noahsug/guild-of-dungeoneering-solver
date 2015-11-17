/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import _ from 'underscore';
import glob from 'glob';
import { join } from 'path';

export default function routesLoader(source) {
  this.cacheable();
  const target = this.target;
  const callback = this.async();

  if (target === 'node') {
    source = source.replace('import \'babel/polyfill\';', '');
  }

  glob('**/*.{js,jsx}', { cwd: join(__dirname, '../../src/pages') }, (err, files) => {
    if (err) {
      return callback(err);
    }

    const lines = files.map(file => {
      let path = '/' + file;

      if (path === '/index.js' || path === '/index.jsx') {
        path = '/';
      } else {
        _.some(['/index.js', '/index.jsx', '.js', '.jsx'], suffix => {
          if (path.endsWith(suffix)) {
            path = path.slice(0, -suffix.length);
            return true;
          }
          return false;
        });
      }

      if (target === 'node' || path === '/404' || path === '/500') {
        return `  '${path}': function() {return require('./pages/${file}');},`;
      }

      return `  '${path}': function() {return new Promise(` +
          `resolve => require(['./pages/${file}'], resolve));},`;
    });

    if (lines.length) {
      return callback(null, source.replace(' routes = {',
                                           ' routes = {\n' + lines.join('')));
    }

    return callback(new Error('Cannot find any routes.'));
  });
}
