import GameStateAccessor from './game-state-accessor';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Expectimax from './expectimax';
import Card from './card';
import gameData from './game-data';

export default class GodSolverFactory {
  create(player, enemy, runOptions) {
    const initialState = this.getInitialState_(player, enemy);
    return this.createCustom(initialState, runOptions);
  }

  getInitialState_(playerInfo, enemyInfo) {
    const state = {};
    Object.assign(state, this.getInitialStateForPlayer_('player', playerInfo));
    Object.assign(state, this.getInitialStateForPlayer_('enemy', enemyInfo));
    return GameStateAccessor.create(state);
  }

  getInitialStateForPlayer_(name, info) {
    const char = gameData.players[info.type];
    const sets = char.sets.concat(info.sets || []);
    const traits = (char.traits || []).concat(info.traits || []);

    (info.items || []).forEach((i) => {
      const item = gameData.items[i];
      sets.push(...(item.sets || []));
      traits.push(...(item.traits || []));
    });

    const state = {};
    state[name + 'Deck'] = this.getDeck_(sets);
    state[name + 'Health'] = char.health;

    Object.assign(state, this.getTraits_(name, traits));
    this.resolveTraits_(name, state);
    return state;
  }

  getDeck_(sets) {
    let deck = [];
    sets.forEach(set => deck = deck.concat(Card.getSet(set)));
    return deck;
  }

  getTraits_(name, traitList) {
    const traits = {};
    traitList.forEach((trait) => {
      if (!traits[name + trait]) traits[name + trait] = 0;
      traits[name + trait]++;
    });
    return traits;
  }

  resolveTraits_(name, state) {
    const player = GameStateAccessor.instance.setState(state)[name];
    for (let i = 1; i < 9; i++) {
      let trait = name + '+' + i + 'HP';
      if (state[trait]) {
        state[name + 'Health'] += i * state[trait];
        delete state[trait];
      }
      trait = name + '-' + i + 'HP';
      if (state[trait]) {
        state[name + 'Health'] -= i * state[trait];
        delete state[trait];
      }
    }
  }

  createCustom(gameState, {iteration = 5000}) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const expectimax = new Expectimax({nodeFactory, runUntil: {iteration}});
    expectimax.setState(gameState);
    return expectimax;
  }
}
