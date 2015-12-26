import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Guide from './components/Guide';
import App from './components/App';

function run() {
  const container = document.getElementById('content');
  if (window.location.search == '?i') {
    const app = new App(container);
    app.render();
  } else {
    ReactDOM.render(
      <Guide />,
      container);
  }
}

if (canUseDOM) {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) &&
      document.body) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run, false);
  }
}
