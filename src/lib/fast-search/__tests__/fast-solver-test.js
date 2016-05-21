import _ from '../../../utils/common';
jest.autoMockOff();

describe('fast solver', () => {
  const FastSolver = require('../fast-solver');
  const Inspector = require('../inspector');
  const Card = require('../../game-engine/card');
  const gameData = require('../../game-engine/game-data');
  const p = require('../pretty-print');
  let solver;

  function inspect(solver) {
    const inspector = Inspector.inspect(solver);
    console.log('');
    inspector.breakdown.forEach((byHand) => {
      console.log(p.cards(byHand.state.player.hand), '->',
                  p.percent(byHand.result));
      byHand.byEnemyCard.forEach((byEnemyCard) => {
        console.log('-', p.card(byEnemyCard.card), byEnemyCard.count, '->',
                    p.percent(byEnemyCard.result));
      });
    });
  }

  function getCards(descList) {
    return descList.map((d) => Card.get(d)).sort();
  }

  function getStateWithPlayerHand(handDesc) {
    const playerHand = getCards(handDesc);
    const state = solver.states.find((s) => {
      return _.isEqual(s.player.hand.sort(), playerHand);
    });
    expect(state).toBeDefined();
    return state;
  }

  beforeEach(() => {
    solver = new FastSolver();
  });

  it('creates starting states', () => {
    solver.init({name: 'Chump'}, {name: 'Fire Imp'});
    expect(solver.states.length).toBe(20);

    const cards = gameData.sets.Chump;
    const hand = getCards([cards[2], cards[3], cards[4]]);
    const deck = getCards([cards[0], cards[1], cards[5]]);
    let match = false;
    solver.states.forEach((state) => {
      if (_.isEqual(state.player.deck.sort(), deck) &&
          _.isEqual(state.player.hand.sort(), hand) &&
          _.isEqual(state.player.discard, [])) {
        match = true;
      }
    });
    expect(match).toBe(true);
  });

  it('can solve a starting hand', () => {
    solver.init({name: 'Chump'}, {name: 'Fire Imp'});
    expect(solver.count).toBe(0);
    expect(solver.sum).toBe(0);

    solver.next();
    expect(solver.count).toBe(1);
    expect(solver.sum).toBe(1);
  });

  xit('solves chump vs gray ooze', () => {
    solver.init({name: 'Chump', traits: ['Crones Discipline']},
                {name: 'Gray Ooze'});
    for (let i = 0; i < 20000; i++) {
      solver.next();
    }
    expect(solver.result).toBeBetween(0.36, 0.46);
  });

  xit('solves Apprentice vs Ghost', () => {
    solver.init({name: 'Apprentice', items: ['Shimmering Cloak']},
                {name: 'Ghost'});
    for (let i = 0; i < 20000; i++) {
      solver.next();
    }
    expect(solver.result).toBeBetween(0.68, 0.79);
  });

  it('solves complex problems', () => {
    solver.init({
      name: 'Chump',
      items: ['Scroll Of Souls', 'Fez', 'Ocean Staff', 'Bark Vest'],
      traits: [],
    }, {name: 'Angry Bunny'});
    solver.next();
    expect(solver.result).toBeBetween(0, 1);
  });

  xit('tests performance', () => {
    // 5 SECONDS
    solver.init({
      name: 'Cartomancer',
      items: ['Conch', 'Shimmering Cloak', 'Mail Coif', 'Net'],
      traits: [],
    }, {name: 'Angry Bunny'});

    const a = Date.now();
    for (let i = 0; i < 2000; i++) {
      solver.next();
      if (i % 500 == 0) console.log(solver.result);
    }
    const b = Date.now();
    console.log('TIME:', b - a);
  });

  it.only('tests accuracy', () => {
    solver.init({name: 'Apprentice', items: ['Shimmering Cloak']},
                {name: 'Ghost'});
    //solver.init({name: 'Chump', traits: ['Crones Discipline']},
    //            {name: 'Gray Ooze'});
    //solver.init({name: 'Chump', traits: ['Crones Discipline', 'Level 2']},
    //            {name: 'Rat King'});
    //solver.init({name: 'Cartomancer', traits: ['Level 3']},
    //            {name: 'Angry Bunny'});

    let state;
    //state = getStateWithPlayerHand(['M/U', 'M/U', 'M/Q']);
    //solver.play(state, Card.get('M/Q'), Card.get('BP/M'));
    //state = getStateWithPlayerHand(['P', 'P', 'P', 'B']);
    //solver.play(state, Card.get('B'), Card.get('HPD/M'));
    //state = getStateWithPlayerHand(['P', 'P', 'P', 'B']);
    //solver.play(state, Card.get('B'), Card.get('BP/M'));
    //state = getStateWithPlayerHand(['P', 'P', 'P', 'B']);
    //solver.play(state, Card.get('B'), Card.get('M'));

    //state = getStateWithPlayerHand(['M/Q', 'M/U', 'M/U']);
    //solver.states = [state];
    //state.debug = 'BP/M';
    //solver.order_.enemyPlayed(Card.get('BP/M'));

    //const playerHand = getCards(['P', 'P', 'P/P', 'P']);
    //solver.states.forEach((s) => {
    //  if (_.isEqual(s.player.hand.sort(), playerHand)) {
    //    s.debug = 'M/U';
    //  }
    //});

    //solver.record = [];
    for (let i = 0; i < 20000; i++) {
      solver.next();
      if (i % 500 == 0) console.log(solver.result);
    }
    console.log('RESULT', solver.result);
    //inspect(solver);

    //window.d = true;
    //for (let i = 0; i < 10; i++) {
    //  solver.next();
    //}
    //console.log('DEBUG', solver.result);

    //const state = getStateWithPlayerHand(['P', 'P/P', 'P', 'B']);
    //solver.states = [state];
    //solver.order_.enemyPlayed(Card.get('M'));
    //
    //window.e = true;
    //solver.record = [];
    //for (let i = 0; i < 700; i++) {
    //  solver.next();
    //  if (i % 500 == 0) console.log(solver.result);
    //}
    //console.log('RESULT 2', solver.result);
    //inspect(solver);
  });
});
