jest.autoMockOff();

describe('routes-loader', () => {
  const routesLoader = require('../routes-loader').default;
  pit('should load a list of routes', () => {
    return new Promise((resolve) => {
      const ctx = {
        cacheable: () => {},
        async: () => (err, result) => resolve({err, result}),
      };
      routesLoader.call(ctx, 'const routes = {};');
    }).then(({err, result}) => {
      expect(err).toBe(null);
      ['/404', '/500', '/'].forEach((page) => {
        expect(result).toContain(`'${page}'`);
      });
    });
  });
});
