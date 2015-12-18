import GameStateAccessor from './game-state-accessor';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Expectimax from './expectimax';
import Card from './card';
import gameData from './game-data';

export default class GodSolverFactory {
  create(player, enemy, runOptions) {
    player = gameData.players[player];
    enemy = gameData.players[enemy];
    const initialState = this.getInitialState_(player, enemy);
    return this.createCustom(initialState, runOptions);
  }

  getInitialState_(player, enemy) {
    const state = {
      playerDeck: this.getDeck_(player.sets),
      enemyDeck: this.getDeck_(enemy.sets),
      playerHealth: player.health,
      enemyHealth: enemy.health,
    };
    Object.assign(state, this.getTraits_('player', player));
    Object.assign(state, this.getTraits_('enemy', enemy));
    return GameStateAccessor.create(state);
  }

  getTraits_(name, player) {
    const traits = {};
    (player.traits || []).forEach((trait) => {
      traits[name + trait] = true;
    });
    return traits;
  }

  getDeck_(sets) {
    let deck = [];
    sets.forEach(set => deck = deck.concat(Card.getSet(set)));
    return deck;
  }

  createCustom(gameState, {iteration = 5000}) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const expectimax = new Expectimax({nodeFactory, runUntil: {iteration}});
    expectimax.setState(gameState, {newGame: true});
    return expectimax;
  }
}
