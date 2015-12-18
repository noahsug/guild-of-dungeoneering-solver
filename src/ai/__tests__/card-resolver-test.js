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
    resolver.resolve(state, Card.create('P/HID'), Card.create('B'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P/HID'), Card.create('BM'));
    expect(player.health).toBe(6);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('H/H/H'), Card.create('BM/B/BP'));
    expect(player.health).toBe(9);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('HPD/P/M'), Card.create('BM'));
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

  it('resolves effects', () => {
    const state = GameStateAccessor.create({});
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('D/C/S/MN/PN/Co'), Card.create('BP'));
    const playerEffects = ['steal', 'conceal', 'draw', 'physicalNext',
                           'magicNext'];
    playerEffects.forEach((e) => expect(player[e + 'Effect']).toBe(1));
  });

  it('resolves duplicate effects', () => {
    const state = GameStateAccessor.create({});
    const [player, enemy] = GameStateAccessor.access(state);
    resolver.resolve(state, Card.create('D/D/D'), Card.create('BP'));
    expect(player.drawEffect).toBe(3);
  });

  it('resolves if damage effects', () => {
    const state = GameStateAccessor.create({});
    const [player, enemy] = GameStateAccessor.access(state);
    const card = Card.create('P/Di/PRID/MRID/SID/CoID');
    const playerEffects = ['steal', 'conceal'];
    const enemyEffects = ['discard', 'physicalRound', 'magicRound'];
    resolver.resolve(state, card, Card.create('BP'));
    playerEffects.forEach((e) => expect(player[e + 'Effect']).toBe(0));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(0));
    resolver.resolve(state, card, Card.create('BM'));
    playerEffects.forEach((e) => expect(player[e + 'Effect']).toBe(1));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(1));
  });
});
