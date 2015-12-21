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
    const enemyEffects = ['cycle'];
    playerEffects.forEach((e) => expect(player[e + 'Effect']).toBe(1));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(1));
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

  it('resolves per block cards', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);
    const card = Card.create('B/B/SPB/HPB');

    resolver.resolve(state, card, Card.create('B'));
    expect(player.stealEffect).toBe(0);
    expect(player.health).toBe(5);

    resolver.resolve(state, card, Card.create('P'));
    expect(player.stealEffect).toBe(1);
    expect(player.health).toBe(6);

    resolver.resolve(state, card, Card.create('P/P'));
    expect(player.stealEffect).toBe(3);
    expect(player.health).toBe(8);
  });

  it('resolves block all cards', () => {
    const state = GameStateAccessor.create({
      playerHealth: 5,
    });
    const [player, enemy] = GameStateAccessor.access(state);

    resolver.resolve(state, Card.create('BPA'), Card.create('P/P/P/P'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BMA'), Card.create('M/M/M/M'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BA'), Card.create('P/P/M/M'));
    expect(player.health).toBe(5);
  });

  it('resolves health = 6', () => {
    const state = GameStateAccessor.create({
      playerHealth: 1,
    });
    const [player, enemy] = GameStateAccessor.access(state);

    resolver.resolve(state, Card.create('H6/Q'), Card.create('P/P/P/P'));
    expect(player.health).toBe(2);
  });

  it('resolves bonus physical dmg vs unblockable', () => {
    const state = GameStateAccessor.create({
      enemyHealth: 10,
      playerHealth: 10,
    });
    const [player, enemy] = GameStateAccessor.access(state);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P'));
    expect(enemy.health).toBe(8);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P/U'));
    expect(enemy.health).toBe(5);
  });

  it('resolves bonus dmg on next attack', () => {
    const state = GameStateAccessor.create({
      enemyHealth: 10,
      playerHealth: 10,
    });
    const [player, enemy] = GameStateAccessor.access(state);

    resolver.resolve(state, Card.create('PN/MN'), Card.create('B'));
    resolver.resolve(state, Card.create('PN/PN/PN'), Card.create('B'));
    expect(enemy.health).toBe(10);

    resolver.resolve(state, Card.create('P'), Card.create('B'));
    expect(enemy.health).toBe(6);

    resolver.resolve(state, Card.create('P'), Card.create('B'));
    expect(enemy.health).toBe(6);

    resolver.resolve(state, Card.create('M'), Card.create('B'));
    expect(enemy.health).toBe(5);

    resolver.resolve(state, Card.create('M'), Card.create('B'));
    expect(enemy.health).toBe(5);
  });

  it('resolves dmg per round', () => {
    const state = GameStateAccessor.create({
      enemyHealth: 10,
      playerHealth: 10,
    });
    const [player, enemy] = GameStateAccessor.access(state);

    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(8);

    resolver.resolve(state, Card.create('P'), Card.create('B/B'));
    expect(enemy.health).toBe(7);

    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(4);

    resolver.resolve(state, Card.create('?'), Card.create('?'));
    expect(enemy.health).toBe(2);
  });
});
