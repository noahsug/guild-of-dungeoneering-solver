jest.dontMock('../card-resolver');
jest.dontMock('../player-card-resolver');
jest.dontMock('../game-state-accessor');
jest.dontMock('../game-state-player-accessor');
jest.dontMock('../card');
jest.dontMock('../../game-data');

describe('card resolver resolves', () => {
  const CardResolver = require('../card-resolver');
  const Card = require('../card');
  const GameStateAccessor = require('../game-state-accessor');
  const resolver = new CardResolver();
  const accessor = new GameStateAccessor();

  function useState(hp, options = {}) {
    const stateOptions = Object.assign({enemyHealth: hp, playerHealth: hp},
                                       options);
    const state = GameStateAccessor.create(stateOptions);
    resolver.setInitialState(state);
    const nextState = GameStateAccessor.clone(state);
    return [nextState, ...accessor.setState(nextState).access()];
  }

  it('dmg', () => {
    const [state, player, enemy] = useState(5);
    resolver.resolve(state, Card.create('P/P/P'), Card.create('P'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(2);
    resolver.resolve(state, Card.create('M/M/P'), Card.create('P'));
    expect(player.health).toBe(3);
    expect(enemy.dead).toBe(true);
  });

  it('blocking', () => {
    const [state, player, enemy] = useState(5);
    resolver.resolve(state, Card.create('BP/BP/M/M'), Card.create('BM/P/P'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
    resolver.resolve(state, Card.create('M/P/P/P'), Card.create('B/BM/BM/BP'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(3);
  });

  it('quick attacks', () => {
    const [state, player, enemy] = useState(1);
    resolver.resolve(state, Card.create('Q/P'), Card.create('P/P/P'));
    expect(player.dead).toBe(false);
    expect(enemy.dead).toBe(true);
  });

  it('quick attacks against self dmg', () => {
    const [state, player, enemy] = useState(2);
    resolver.resolve(state, Card.create('Q/P'), Card.create('-H/P/P'));
    expect(player.dead).toBe(true);
    expect(enemy.dead).toBe(true);
    expect(accessor.result).toBe(-1);
  });

  it('unblockable attacks', () => {
    const [state, player, enemy] = useState(5);
    resolver.resolve(state, Card.create('U/P'), Card.create('B'));
    expect(player.health).toBe(5);
    expect(enemy.health).toBe(4);
  });

  it('heals', () => {
    const [state, player, enemy] = useState(5);
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
    const [state, player, enemy] = useState(5);
    resolver.resolve(state, Card.create('-H'), Card.create('?'));
    expect(player.health).toBe(4);
    expect(enemy.health).toBe(5);
  });

  it('effects', () => {
    const [state, player, enemy] = useState(10);
    resolver.resolve(state, Card.create('D/C/MN/PN'), Card.create('BP'));
    const playerEffects = ['draw', 'physicalNext', 'magicNext', 'cycle'];
    playerEffects.forEach((e) => {
      if (!player[e + 'Effect']) console.error('Missing ', e + 'Effect');
      expect(player[e + 'Effect']).toBe(1);
    });
  });

  it('duplicate effects', () => {
    const [state, player, enemy] = useState(10);
    resolver.resolve(state, Card.create('D/D/D'), Card.create('BP'));
    expect(player.drawEffect).toBe(3);
  });

  it('if damage effects', () => {
    const [state, player, enemy] = useState(10);
    const card = Card.create('P/DID/PRID/MRID');
    const enemyEffects = ['discard', 'physicalRound', 'magicRound'];

    resolver.resolve(state, card, Card.create('BP'));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(0));

    resolver.resolve(state, card, Card.create('BM'));
    enemyEffects.forEach((e) => expect(enemy[e + 'Effect']).toBe(1));
  });

  it('per block cards', () => {
    const [state, player, enemy] = useState(5);
    const card = Card.create('B/B/HPB');

    resolver.resolve(state, card, Card.create('B'));
    expect(player.health).toBe(5);

    resolver.resolve(state, card, Card.create('P'));
    expect(player.health).toBe(6);

    resolver.resolve(state, card, Card.create('P/P'));
    expect(player.health).toBe(8);
  });

  it('block all cards', () => {
    const [state, player, enemy] = useState(5);

    resolver.resolve(state, Card.create('BPA'), Card.create('P/P/P/P'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BMA'), Card.create('M/M/M/M'));
    expect(player.health).toBe(5);

    resolver.resolve(state, Card.create('BA'), Card.create('P/P/M/M'));
    expect(player.health).toBe(5);
  });

  it('health = 6', () => {
    const [state, player, enemy] = useState(1);

    resolver.resolve(state, Card.create('H6/Q'), Card.create('P/P/P/P'));
    expect(player.health).toBe(2);
  });

  it('bonus physical dmg vs unblockable', () => {
    const [state, player, enemy] = useState(10);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P'));
    expect(enemy.health).toBe(8);

    resolver.resolve(state, Card.create('P/P/PVU'), Card.create('P/U'));
    expect(enemy.health).toBe(5);
  });

  it('bonus dmg on next attack', () => {
    const [state, player, enemy] = useState(10);

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
    const [state, player, enemy] = useState(10);

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
    const [state, player, enemy] = useState(10, {enemyFrail: 1});
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('M'), Card.create('?'));
    expect(enemy.health).toBe(7);
  });

  it('mundane', () => {
    const [state, player, enemy] = useState(10, {enemyMundane: 1});
    resolver.resolve(state, Card.create('M'), Card.create('?'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(7);
  });

  it('fury', () => {
    const [state, player, enemy] = useState(10, {playerFury: 1});
    resolver.resolve(state, Card.create('P'), Card.create('P/P/P/P/P'));
    expect(enemy.health).toBe(9);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('H/P'), Card.create('?'));
    expect(enemy.health).toBe(5);
  });

  it('fury + quick', () => {
    const [state, player, enemy] = useState(4, {enemyFury: 1});
    // Quick doesn't trigger fury on the same turn.
    resolver.resolve(state, Card.create('P/P/P/Q'), Card.create('P'));
    expect(player.health).toBe(3);
  });

  it('brittle', () => {
    const [state, player, enemy] = useState(10, {enemyBrittle: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('H/H/H'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('P/P/P/PRID'), Card.create('H/H/H'));
    expect(enemy.health).toBe(7);
    resolver.resolve(state, Card.create('P/P/P'), Card.create('H/H/H'));
    expect(enemy.health).toBe(4);
  });

  it('tenacious', () => {
    const [state, player, enemy] = useState(5, {enemyTenacious: 1});
    resolver.resolve(state, Card.create('P/P/P/P/P/P'), Card.create('?'));
    expect(enemy.health).toBe(1);
  });

  it('sluggish', () => {
    const [state, player, enemy] = useState(5, {playerSluggish: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/BP'));
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/B/HPB'));
    expect(enemy.health).toBe(9);
  });

  it('bulwark', () => {
    const [state, player, enemy] = useState(5, {enemyBulwark: 1});
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
    const [state, player, enemy] = useState(10, {enemyRetribution: 1});
    resolver.resolve(state, Card.create('M/M/M'), Card.create('H/H/H'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('M/M/M/BM'), Card.create('H/H/H'));
    expect(player.health).toBe(9);
    resolver.resolve(state, Card.create('?'), Card.create('-H/-H/-H'));
    expect(player.health).toBe(8);
  });

  it('decay', () => {
    const [state, player, enemy] = useState(10, {enemyDecay: 1});
    resolver.resolve(state, Card.create('P/P'), Card.create('?'));
    expect(enemy.health).toBe(7);

    // Burn counts as dmg taken towards decay.
    resolver.resolve(state, Card.create('P/PRID'), Card.create('?'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P'), Card.create('?'));
    expect(enemy.health).toBe(3);
  });

  it('tough', () => {
    const [state, player, enemy] = useState(5, {enemyTough: 1});
    resolver.resolve(state, Card.create('P/P/P/P'), Card.create('B/B/HPB'));
    expect(enemy.health).toBe(7);
  });

  it('spikey', () => {
    const [state, player, enemy] = useState(10, {enemySpikey: 1});
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
    const [state, player, enemy] = useState(5, {enemyRum: 1});
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
    const [state, player, enemy] = useState(10, {playerFerocious: 1});
    resolver.resolve(state, Card.create('P/P/P'), Card.create('?'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P/P/M'), Card.create('?'));
    expect(enemy.health).toBe(3);
  });

  it('burn', () => {
    const [state, player, enemy] = useState(5, {enemyBurn: 1});
    resolver.resolve(state, Card.create('B'), Card.create('BA'));
    expect(enemy.health).toBe(4);
    expect(player.health).toBe(4);
  });

  it('respite', () => {
    const [state, player, enemy] = useState(5, {enemyRespite: 1});
    resolver.resolve(state, Card.create('P'), Card.create('BP'));
    expect(enemy.health).toBe(6);
    resolver.resolve(state, Card.create('P'), Card.create('H'));
    expect(enemy.health).toBe(6);
  });

  it('blessing', () => {
    const [state, player, enemy] = useState(5, {playerBlessing: 1});
    resolver.resolve(state, Card.create('H'), Card.create('BP'));
    expect(player.health).toBe(7);
  });

  it('withstand', () => {
    const [state, player, enemy] = useState(2);
    resolver.resolve(state, Card.create('W'), Card.create('P/P/P'));
    expect(player.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('P/P/P'));
    expect(player.health).toBe(1);
    resolver.resolve(state, Card.create('?'), Card.create('P/P/P'));
    expect(player.health).toBe(-2);
  });

  it('rules lawyer', () => {
    const [state, player, enemy] = useState(5, {playerRulesLawyer: 1});
    resolver.resolve(state, Card.create('P'), Card.create('P'));
    expect(player.drawEffect).toBe(0);
    resolver.resolve(state, Card.create('P'), Card.create('P/P'));
    expect(player.drawEffect).toBe(1);
  });

  it('card storm', () => {
    const [state, player, enemy] = useState(5, {playerHand: [1, 2, 3, 4, 5]});
    resolver.resolve(state, Card.create('Cs'), Card.create('P'));
    expect(enemy.health).toBe(1);
    expect(player.discardEffect).toBe(4);
  });

  it('spellsword', () => {
    const [state, player, enemy] = useState(10, {playerSpellsword: 1});
    resolver.resolve(state, Card.create('P/M'), Card.create('P'));
    expect(enemy.health).toBe(8);
    resolver.resolve(state, Card.create('P/M'), Card.create('P'));
    expect(enemy.health).toBe(5);
    resolver.resolve(state, Card.create('P'), Card.create('P'));
    expect(enemy.health).toBe(3);
  });
});
