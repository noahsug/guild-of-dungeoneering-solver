// jest.dontMock('../routes-loader');

describe('sum', function() {
  it('adds 1 + 2 to equal 3', function() {
    var sum = (a, b) => a + b;
    expect(sum(1, 2)).toBe(4);
  });
});

/*describe('routes-loader', () => {
  it('Should load a list of routes', function(done) {
    this.cacheable = () => {};
    this.async = () => (err, result) => {
      expect(err).to.be.null;
      expect(result).to.not.to.be.empty.and.have.all.keys('/', '/404', '/500');
      done();
    };

    require('../tools/lib/routes-loader').call(this, 'const routes = {};');
  });
});*/
