import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import ToolboxApp from 'react-toolbox/lib/app';
import App from './components/App';
import style from './style.scss';

function run() {
  ReactDOM.render(
    <ToolboxApp className={style.content}>
      <App />
    </ToolboxApp>
  , document.getElementById('app'));
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
