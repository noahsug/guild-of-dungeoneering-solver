jest.autoMockOff();

describe('solver', () => {
  const SolverFactory = require('../solver-factory');
  const gs = require('../game-engine/game-state');
  const Card = require('../game-engine/card');
  const gameData = require('../game-engine/game-data');
  let root;

  function getSolver(player, enemy) {
    const solver = new SolverFactory().create(player, enemy);
    root = solver.rootNode.state;
    return solver;
  }

  it('Chump beats Gray Ooze 41.76% of the time w/ +1 hand size', function() {
    const solver = getSolver({name: 'Chump', traits: ['Crones Discipline']},
                             {name: 'Gray Ooze'});
    solver.solve();
    expect(solver.rootNode.result).toEqualFloat(0.4176, 0.0001);
  });

  it('supports +HP traits', () => {
    const solver = getSolver(
        {name: 'Chump', traits: ['Level 3']}, {name: 'Gray Ooze'});
    expect(root.player.health).toBe(gameData.players.Chump.health + 2);
  });

  it('supports Warriors Might trinket', () => {
    const solver = getSolver({
      name: 'Chump',
      traits: ['Warriors Might'],
    }, {name: 'Gray Ooze'});
    expect(root.player.physicalNextEffect).toBe(1);
  });

  it('supports Phlogis Tonic trinket', () => {
    const solver = getSolver({
      name: 'Chump',
      traits: ['Phlogis Tonic'],
    }, {name: 'Gray Ooze'});
    expect(root.player.health).toBe(gameData.players.Chump.health + 1);
  });

  it('supports Crones Discipline trinket', () => {
    const solver = getSolver({
      name: 'Chump',
      traits: ['Crones Discipline'],
    }, {name: 'Gray Ooze'});
    expect(root.player.extraHandSizeEffect).toBe(1);
  });

  it('ensures Holy I + Holy I = Holy II', () => {
    const solver = getSolver({
      name: 'Chump',
      items: ['Paper Crown', 'Glyph'],
    }, {name: 'Gray Ooze'});
    gameData.sets['Holy 2'].forEach((card) => {
      expect(root.player.deck).toContain(Card.create(card));
    });
  });
});
