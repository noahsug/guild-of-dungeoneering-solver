import GameState from './game-state';
import ExpansionStrategy from './expansion-strategy';
import SelectionStrategy from './selection-strategy';
import NodeFactory from './node-factory';
import Simulator from './simulator';
import Mcts from './mcts';

export default class MctsRunner {
  static run(playerDeck, enemyDeck) {
    const playerHealth = 8;
    const enemyHealth = 8;
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const mcts = new Mcts({
      selectionStrategy: new SelectionStrategy(),
      expansionStrategy: new ExpansionStrategy(nodeFactory),
      nodeFactory: nodeFactory,
      runUntil: {iteration: 50, hitBottom: 100},
    });
    return mcts.solveNewGame(GameState.create(
        {playerDeck, enemyDeck, playerHealth, enemyHealth}));
  }
}
