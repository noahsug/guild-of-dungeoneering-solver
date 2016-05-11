jest.dontMock('../card-resolver');
jest.dontMock('../player-card-resolver');
jest.dontMock('../game-state');
jest.dontMock('../card');
jest.dontMock('../game-data');

xdescribe('card resolver resolves', () => {
  const CardResolver = require('../card-resolver');
  const Card = require('../card');
  const gs = require('../game-state');
  const resolver = new CardResolver();

  let player;
  let enemy;
  let state;

  function useState(health, playerValues = {}, enemyValues = {}) {
    playerValues.health = health;
    enemyValues.health = health;
    state = gs.create(playerValues, enemyValues);
    resolver.setInitialState(state);
    state = gs.clone(state);
    player = state.player;
    enemy = state.enemy;
  }

  it('dmg', () => {
    useState(5);
    resolver.resolve(state, Card.create('P/P/P'), Card.create('P'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(2);
    resolver.resolve(state, Card.create('M/M/P'), Card.create('P'));
    expect(player.health).toBe(3);
    expect(enemy.health <= 0).toBe(true);
  });

  it('blocking', () => {
    useState(5);
    resolver.resolve(state, Card.create('BP/BP/M/M'), Card.create('BM/P/P'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('M/P/P/P'), Card.create('B/BM/BM/BP'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(3);
  });

  it('quick attacks', () => {
    useState(2);
    resolver.resolve(state, Card.create('Q/P/P/U'),
                     Card.create('-H/P/P/BP/BP'));
    expect(player.health <= 0).toBe(false);
    expect(enemy.health <= 0).toBe(true);
  });

  it('quick attacks against self dmg', () => {
    useState(2);
    resolver.resolve(state, Card.create('Q/P'), Card.create('-H/P/P'));
    expect(player.health <= 0).toBe(true);
    expect(enemy.health <= 0).toBe(true);
    expect(gs.result(state)).toBe(-1);
  });

  it('unblockable attacks', () => {
    useState(5);
    resolver.resolve(state, Card.create('U/P'), Card.create('B'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
  });

  it('heals', () => {
    useState(5);
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

  it('self damage', () => {
    useState(5);
    resolver.resolve(state, Card.create('-H'), Card.create('?'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(5);
  });

  it('effects', () => {
    useState(10);
    resolver.resolve(state, Card.create('D/C/MN/PN'), Card.create('BP'));
    const playerEffects = ['draw', 'physicalNext', 'magicNext', 'cycle'];
    playerEffects.forEach((e) => {
      if (!player[e + 'Effect']) console.error('Missing ', e + 'Effect');
      expect(player[e + 'Effect']).toBe(1);
    });
  });

  it('duplicate effects', () => {
    useState(10);
    resolver.resolve(state, Card.create('D/D/D'), Card.create('BP'));
    expect(player.drawEffect).toBe(3);
  });

  it('if damage effects', () => {
    useState(10);
    const card = Card.create('P/DID/PRID/MRID');
    const enemyEffects = ['physicalRound', 'magicRound'];

    resolver.resolve(state, card, Card.create('BP'));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(0));

    resolver.resolve(state, card, Card.create('BM'));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(1));
  });

  it('per block cards', () => {
    useState(5);
    const card = Card.create('B/B/HPB');

    resolver.resolve(state, card, Card.create('B'));
    expect(player.health).toBe(5);

    resolver.resolve(state, card, Card.create('P'));
    expect(player.health).toBe(6);

    resolver.resolve(state, card, Card.create('P/P'));
    expect(player.health).toBe(8);
  });

  it('block all cards', () => {
    useState(5);

    resolver.resolve(state, Card.create('BPA'), Card.create('P/P/P/P'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BMA'), Card.create('M/M/M/M'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BA'), Card.create('P/P/M/M'));
    expect(player.health).toBe(5);
  });

  it('health = 6', () => {
    useState(1);

    resolver.resolve(state, Card.create('H6/Q'), Card.create('P/P/P/P'));
    expect(player.health).toBe(2);
  });

  it('bonus physical dmg vs unblockable', () => {
    useState(10);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P'));
    expect(enemy.health).toBe(8);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P/U'));
    expect(enemy.health).toBe(5);
  });

  it('bonus dmg on next attack', () => {
    useState(10);

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

  it('dmg per round', () => {
    useState(10);

    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(9);

    resolver.resolve(state, Card.create('P'), Card.create('B/B'));
    expect(enemy.health).toBe(8);

    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(6);

    resolver.resolve(state, Card.create('?'), Card.create('?'));
    expect(enemy.health).toBe(4);
  });

  it('frail', () => {
    useState(10, {}, {frail: 1});
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('M'), Card.create('?'));
    expect(enemy.health).toBe(7);
  });

  it('mundane', () => {
    useState(10, {}, {mundane: 1});
    resolver.resolve(state, Card.create('M'), Card.create('?'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(7);
  });

  it('fury', () => {
    useState(10, {fury: 1});
    resolver.resolve(state, Card.create('P'), Card.create('P/P/P/P/P'));
    expect(enemy.health).toBe(9);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('H/P'), Card.create('?'));
    expect(enemy.health).toBe(5);
  });

  it('fury + quick', () => {
    useState(4, {}, {fury: 1});
    // Quick doesn't trigger fury on the same turn.
    resolver.resolve(state, Card.create('P/P/P/Q'), Card.create('P'));
    expect(player.health).toBe(3);
  });

  it('brittle', () => {
    useState(10, {}, {brittle: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('H/H/H'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('P/P/P/PRID'), Card.create('H/H/H'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('P/P/P'), Card.create('H/H/H'));
    expect(enemy.health).toBe(4);
  });

  it('tenacious', () => {
    useState(5, {}, {tenacious: 1});
    resolver.resolve(state, Card.create('P/P/P/P/P/P'), Card.create('?'));
    expect(enemy.health).toBe(1);
  });

  it('sluggish', () => {
    useState(5, {sluggish: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/BP'));
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/B/HPB'));
    expect(enemy.health).toBe(9);
  });

  it('bulwark', () => {
    useState(5, {}, {bulwark: 1});
    resolver.resolve(state, Card.create('P'), Card.create('H'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P/U'), Card.create('?'));
    expect(enemy.health).toBe(5);
    // Bulwark triggers heal per block.
    resolver.resolve(state, Card.create('P/P'), Card.create('B/HPB'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('?'), Card.create('-H/HPB'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('P/P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(6);
    // Bulwark stops bleed.
    resolver.resolve(state, Card.create('?'), Card.create('?'));
    expect(enemy.health).toBe(6);
  });

  it('retribution', () => {
    useState(10, {}, {retribution: 1});
    resolver.resolve(state, Card.create('M/M/M'), Card.create('H/H/H'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('M/M/M/BM'), Card.create('H/H/H'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('?'), Card.create('-H/-H/-H'));
    expect(player.health).toBe(8);
  });

  it('decay', () => {
    useState(10, {}, {decay: 1});
    resolver.resolve(state, Card.create('P/P'), Card.create('?'));
    expect(enemy.health).toBe(7);

    // Burn counts as dmg taken towards decay.
    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(3);
  });

  it('tough', () => {
    useState(5, {}, {tough: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/B/HPB'));
    expect(enemy.health).toBe(7);
  });

  it('spikey', () => {
    useState(10, {}, {spikey: 1});
    resolver.resolve(state, Card.create('P/P'), Card.create('BP/B'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('P/P'), Card.create('BM/B'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(player.health).toBe(9);
    // Spikey doesn't check burn dmg.
    resolver.resolve(state, Card.create('M/M'), Card.create('BM/BM'));
    expect(player.health).toBe(8);
  });

  it('rum', () => {
    useState(5, {}, {rum: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('?'));
    expect(enemy.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('?'));
    expect(enemy.health).toBe(3);
    resolver.resolve(state, Card.create('P/P'), Card.create('?'));
    expect(enemy.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('?'));
    expect(enemy.health).toBe(1);
  });

  it('ferocious', () => {
    useState(10, {ferocious: 1});
    resolver.resolve(state, Card.create('P/P/P'), Card.create('?'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P/P/M'), Card.create('?'));
    expect(enemy.health).toBe(3);
  });

  it('burn', () => {
    useState(5, {}, {burn: 1});
    resolver.resolve(state, Card.create('B'), Card.create('BA'));
    expect(enemy.health).toBe(4);
    expect(player.health).toBe(4);
  });

  it('respite', () => {
    useState(5, {}, {respite: 1});
    resolver.resolve(state, Card.create('P'), Card.create('BP'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P'), Card.create('H'));
    expect(enemy.health).toBe(6);
  });

  it('blessing', () => {
    useState(5, {blessing: 1});
    resolver.resolve(state, Card.create('H'), Card.create('BP'));
    expect(player.health).toBe(7);
  });

  it('withstand', () => {
    useState(2);
    resolver.resolve(state, Card.create('W'), Card.create('P/P/P'));
    expect(player.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('P/P/P'));
    expect(player.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('P/P/P'));
    expect(player.health).toBe(-2);
  });

  it('rules lawyer', () => {
    useState(5, {rulesLawyer: 1});
    resolver.resolve(state, Card.create('P'), Card.create('P'));
    expect(player.drawEffect).toBe(0);
    resolver.resolve(state, Card.create('P'), Card.create('P/P'));
    expect(player.drawEffect).toBe(1);
  });

  it('card storm', () => {
    useState(5, {hand: [1, 2, 3, 4, 5]});
    resolver.resolve(state, Card.create('Cs'), Card.create('P'));
    expect(enemy.health).toBe(1);
    expect(player.discardEffect).toBe(4);
  });

  it('spellsword', () => {
    useState(10, {spellsword: 1});
    resolver.resolve(state, Card.create('P/M'), Card.create('P'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('P/M'), Card.create('P'));
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P'), Card.create('P'));
    expect(enemy.health).toBe(3);
  });
});
