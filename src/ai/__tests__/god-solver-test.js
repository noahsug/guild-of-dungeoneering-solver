jest.autoMockOff();

describe('God solver', () => {
  const GodSolverFactory = require('../god-solver-factory');
  const GameStateAccessor = require('../game-state-accessor');
  const Card = require('../Card');
  const gameData = require('../game-data');
  const root = new GameStateAccessor();

  function getSolver(player, enemy) {
    const solver = new GodSolverFactory().create(player, enemy);
    root.setState(solver.rootNode.gameState.state);
    return solver;
  }

  xit('Chump beats Gray Ooze 41.76% of the time', function() {
    const solver = getSolver({name: 'Chump'}, {name: 'Gray Ooze'});
    solver.solve();
    expect(solver.rootNode.result).toEqualFloat(0.4176, 0.0001);
  });

  it('supports +HP traits', () => {
    const solver = getSolver(
        {name: 'Chump', traits: ['+1HP', '+2HP']}, {name: 'Gray Ooze'});
    expect(root.player.health).toBe(gameData.players.Chump.health + 3);
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
