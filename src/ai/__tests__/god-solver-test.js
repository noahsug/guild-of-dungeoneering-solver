jest.autoMockOff();

describe('God solver', () => {
  const GodSolverFactory = require('../god-solver-factory');

  xit('Chump beats Gray Ooze 41.76% of the time', function() {
    const godSolverFactory = new GodSolverFactory();
    const solver = new GodSolverFactory().create(
        {type: 'Chump'}, {type: 'Gray Ooze'});
    solver.solve();
    expect(solver.rootNode.result).toEqualFloat(0.4176, 0.0001);
  });
});
