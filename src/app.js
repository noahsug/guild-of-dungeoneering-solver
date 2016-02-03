import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import App from './components/App';

function run() {
  const container = document.getElementById('content');
  ReactDOM.render(<App />, container);
}

if (canUseDOM) {
  // Run the application when DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) &&
      document.body) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run, false);
  }
}
