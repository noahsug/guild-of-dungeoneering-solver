import gs from './game-engine/game-state';
import Card from './game-engine/card';
import gameData from './game-engine/game-data';
import _ from '../utils/common';

export default class GameStateFactory {
  static create(player, enemy) {
    return new GameStateFactory().create(player, enemy);
  }

  create(playerDesc, enemyDesc) {
    const player = this.createInitialState_(playerDesc, gameData.players);
    const enemy = this.createInitialState_(enemyDesc, gameData.enemies);
    return gs.create(player, enemy);
  }

  createInitialState_(desc, playerList) {
    const player = playerList[desc.name];
    _.assert(player, 'invalid name: ' + desc.name);
    let sets = player.sets.concat(desc.sets || []);
    const traits = (player.traits || []).concat(desc.traits || []);

    (desc.items || []).forEach((i) => {
      const item = gameData.items[i];
      sets.push(...(item.sets || []));
      traits.push(...(item.traits || []));
    });

    const state = {health: player.health};
    const traitSets = this.resolveSituationalTraits_(state, traits);
    sets = sets.concat(traitSets);
    Object.assign(state, this.getTraits_(traits));
    state.deck = this.getDeck_(sets);
    return state;
  }

  resolveSituationalTraits_(state, traits) {
    const setNames = ['fire', 'armour', 'blade', 'crush', 'holy', 'arcane',
                      'growth', 'swift', 'stupidity'];
    const sets = [];
    traits.forEach((trait) => {
      const desc = gameData.traits[trait];
      if (!desc) return;
      _.increment(state, 'health', desc.health || 0);
      _.increment(state, 'physicalNextEffect', desc.physicalNext || 0);
      _.increment(state, 'extraHandSizeEffect', desc.extraHandSize || 0);
      _.increment(state, 'tenacious', desc.tenacious || 0);
      _.increment(state, 'punchDrunk', desc.punchDrunk || 0);
      _.increment(state, 'burn', desc.burn || 0);
      setNames.forEach(set => {
        if (desc[set]) sets.push(_.s.capitalize(set) + ' ' + desc[set]);
      });
    });
    return sets;
  }

  getTraits_(traitList) {
    const traits = {};
    traitList.forEach((trait) => {
      const traitName = _.s.decapitalize(trait.replace(' ', ''));
      _.increment(traits, traitName);
    });
    return traits;
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
}
