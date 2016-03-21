import Simulator from './game-engine/simulator';
import NodeFactory from './tree-search/node-factory';
import Expectimax from './tree-search/expectimax';
import GameStateFactory from './game-state-factory';

export default class SolverFactory {
  create(player, enemy) {
    const initialState = GameStateFactory.create(player, enemy);
    return this.createFromState_(initialState);
  }

  createFromState_(gameState) {
    const simulator = new Simulator();
    const nodeFactory = new NodeFactory(simulator);
    const expectimax = new Expectimax(nodeFactory);
    expectimax.setState(gameState);
    return expectimax;
  }
}
