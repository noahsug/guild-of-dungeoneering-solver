jest.dontMock('../card-resolver');

describe('card resolver', () => {
  const CardResolver = require('../card-resolver');
  const resolver = new CardResolver();

  it('resolves', () => {
    const state = {
      playerHealth: 5,
      enemyHealth: 5,
    };
    resolver.resolve(state, 3, 5);
    expect(state).toContainKVs({playerHealth: 0, enemyHealth: 5});
  });
});
