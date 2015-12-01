import 'babel-polyfill';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import App from './components/App';

function run() {
  const container = document.getElementById('app');
  const app = new App(container);
  app.render();
}

if (canUseDOM) {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run, false);
  }
}
