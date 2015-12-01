import GameState from './game-state';
import ExpansionStrategy from './expansion-strategy';
import SelectionStrategy from './selection-strategy';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Mcts from './mcts';

export default class MctsRunner {
  static run(playerDeck, enemyDeck,
             {iteration = 5000, hitBottom = Infinity}) {
    this.playerHealth = 6;
    this.enemyHealth = 6;
    this.simulator = new Simulator();
    this.nodeFactory = new NodeFactory(this.simulator);
    this.mcts = new Mcts({
      selectionStrategy: new SelectionStrategy(),
      expansionStrategy: new ExpansionStrategy(this.nodeFactory),
      nodeFactory: this.nodeFactory,
      //runUntil: {iteration: 10000000, hitBottom: 100000000},
      runUntil: {iteration, hitBottom},
    });
    return this.mcts.solveNewGame(GameState.create(
        {playerDeck, enemyDeck,
         playerHealth: this.playerHealth,
         enemyHealth: this.enemyHealth}));
  }
}
