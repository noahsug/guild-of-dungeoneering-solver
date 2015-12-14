import GameStateAccessor from './game-state-accessor';
import ExpansionStrategy from './expansion-strategy';
import SelectionStrategy from './selection-strategy';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Mcts from './mcts';
import Card from './card';
import gameData from './game-data';

export default class MctsRunner {
  static run(player, enemy, runOptions) {
    player = gameData.players[player];
    enemy = gameData.players[enemy];
    const initialState = this.getInitialState_(player, enemy);
    return MctsRunner.runCustom(initialState, runOptions);
  }

  static getInitialState_(player, enemy) {
    const state = {
      playerDeck: MctsRunner.getDeck(player.sets),
      enemyDeck: MctsRunner.getDeck(enemy.sets),
      playerHealth: player.health,
      enemyHealth: enemy.health,
    };
    Object.assign(state, this.getTraits_('player', player));
    Object.assign(state, this.getTraits_('enemy', enemy));
    return GameStateAccessor.create(state);
  }

  static getTraits_(name, player) {
    const traits = {};
    (player.traits || []).forEach((trait) => {
      traits[name + trait] = true;
    });
    return traits;
  }

  static getDeck(sets) {
    let deck = [];
    sets.forEach(set => deck = deck.concat(Card.getSet(set)));
    return deck;
  }

  static runCustom(gameState, {iteration = 5000}) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    return new Mcts({
      selectionStrategy: new SelectionStrategy(),
      expansionStrategy: new ExpansionStrategy(nodeFactory),
      nodeFactory: nodeFactory,
      runUntil: {iteration},
    }).setState(gameState, {newGame: true});
  }
}
