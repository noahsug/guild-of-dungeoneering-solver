import _ from 'underscore';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
  }

  createRootNode(gameState) {
    const rootNode = new Node(gameState, 'root');
    const initialStates = this.simulator.getInitialStates(gameState);
    rootNode.children = initialStates.map((state) => {
      return new Node(state, 'chance');
    });
    return rootNode;
  }

  createChildren(node) {
    if (node.type == 'chance') {
      const moves = this.simulator.getMoves(node.gameState);
      return moves.map((move) => {
        const child = new Node({move, state: node.state}, 'player');
        child.parent = node;
        return child;
      });
    }

    // node.type == 'player'
    const gameState = _.clone(node.gameState.state);
    const states = this.simulator.getStates(gameState, node.gameState.move);
    return states.map((state) => {
      const child = new Node(state, 'chance');
      child.parent = node;
      return child;
    });
  }
}
