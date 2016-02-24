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
    const char = gameData[name == 'player' ? 'players' : 'enemies'][info.name];
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

    this.resolveTraits_(name, state, traits);
    Object.assign(state, this.getTraits_(name, traits));
    return state;
  }

  getDeck_(sets) {
    sets = this.addSetNumbers_(sets);
    let deck = [];
    sets.forEach(set => deck = deck.concat(Card.getSet(set)));
    return deck;
  }

  addSetNumbers_(sets) {
    const setNumbers = {};
    sets.forEach((set) => {
      const num = Number(_.last(set));
      if (!num) {
        setNumbers[set] = 0;
      } else {
        _.increment(setNumbers, set.slice(0, -2), num);
      }
    });
    const mergedSets = [];
    _.each(setNumbers, (num, set) => {
      if (!num) {
        mergedSets.push(set);
      } else {
        let name = set + ' ' + num;
        while (!gameData.sets[name]) {
          num--;
          name = set + ' ' + num;
          _.assert(num);
        }
        mergedSets.push(name);
      }
    });
    return mergedSets;
  }

  resolveTraits_(name, state, traits) {
    const player = GameStateAccessor.instance.setState(state)[name];
    traits.forEach((trait) => {
      const info = gameData.traits[trait];
      if (!info) return;
      _.increment(state, name + 'Health', info.health || 0);
      _.increment(state, name + 'PhysicalNextEffect', info.physicalNext || 0);
      _.increment(state, name + 'ExtraHandSizeEffect', info.extraHandSize || 0);
    });
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

  createCustom(gameState, {iteration = 15000000, debug = false} = {}) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const expectimax = new Expectimax({
      nodeFactory, runUntil: {iteration}, debug});
    expectimax.setState(gameState);
    return expectimax;
  }
}
