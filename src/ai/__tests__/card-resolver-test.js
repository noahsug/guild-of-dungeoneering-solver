jest.dontMock('../card-resolver');
jest.dontMock('../game-state-accessor');
jest.dontMock('../card');
jest.dontMock('../game-data');

describe('card resolver', () => {
  const CardResolver = require('../card-resolver');
  const Card = require('../card');
  const GameStateAccessor = require('../game-state-accessor');
  const resolver = new CardResolver();

  it('resolves dmg', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('P/P/P'), Card.create('P'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(2);
    resolver.resolve(state, Card.create('M/M/P'), Card.create('P'));
    expect(player.health).toBe(3);
    expect(enemy.dead).toBe(true);
  });

  it('resolves blocking', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('BP/BP/M/M'), Card.create('BM/P/P'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('M/P/P/P'), Card.create('B/BM/BM/BP'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(3);
  });

  it('resolves quick attacks', () => {
    const state = GameStateAccessor.create({
      playerHealth: 1,
      enemyHealth: 1,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('Q/P'), Card.create('P/P/P'));
    expect(player.dead).toBe(false);
    expect(enemy.dead).toBe(true);
  });

  it('resolves unblockable attacks', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('U/P'), Card.create('B'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
  });

  it('resolves heals', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('P/HI'), Card.create('B'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P/HI'), Card.create('BM'));
    expect(player.health).toBe(6);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('H/H/H'), Card.create('BM/B/BP'));
    expect(player.health).toBe(9);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('HP/P/M'), Card.create('BM'));
    expect(player.health).toBe(10);
    expect(enemy.health).toBe(3);
  });

  it('resolves self damage', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('-H'), Card.create('?'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(5);
  });

  it('resolves discard', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
      enemyHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('P/DI'), Card.create('BP'));
    expect(enemy.discardEffect).toBe(0);
    resolver.resolve(state, Card.create('P/DI'), Card.create('BM'));
    expect(enemy.discardEffect).toBe(1);
  });
});
