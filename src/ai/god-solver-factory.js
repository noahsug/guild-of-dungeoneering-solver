import GameStateAccessor from './game-state-accessor';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Expectimax from './expectimax';
import Card from './card';
import gameData from './game-data';
import _ from '../utils/common';

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
    const char = gameData.players[info.name];
    _.assert(char, 'invalid name: ' + info.name);
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
      const traitName = name + trait.replace(' ', '');
      if (!traits[traitName]) traits[traitName] = 0;
      traits[traitName]++;
    });
    return traits;
  }

  resolveTraits_(name, state) {
    const player = GameStateAccessor.instance.setState(state)[name];
    if (state[name + 'WarriorsMight']) {
      state[name + 'PhysicalNextEffect'] = 1;
    }
    if (state[name + 'PhlogisTonic']) {
      state[name + 'Health']++;
    }
    if (state[name + 'CronesDiscipline']) {
      state[name + 'ExtraHandSizeEffect'] = 1;
    }
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

  createCustom(gameState, {iteration = 15000000, debug = false} = {}) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const expectimax = new Expectimax({
      nodeFactory, runUntil: {iteration}, debug});
    expectimax.setState(gameState);
    return expectimax;
  }
}
