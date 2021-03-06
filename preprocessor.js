/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var babel = require('babel-core');

module.exports = {
  process: function(src, filename) {
    // Ignore files other than .js, .es, .jsx or .es6
    if (!babel.util.canCompile(filename)) {
      console.log('cannot compile', filename);
      return '';
    }
    // Ignore all files within node_modules
    if (filename.indexOf('node_modules') === -1) {
      src = babel.transform(src, {
        filename,
        retainLines: true,
      }).code;
      return src;
    }
    return src;
  }
};
