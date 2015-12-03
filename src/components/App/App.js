import './App.scss';
import GameTree from '../GameTree';
import MctsRunner from '../../ai/mcts-runner';
import _ from '../../utils/common';

export default class App {
  constructor(root) {
    this.root = root;
    root.classList.add('App');

    window.addEventListener('keydown', this.onKeyDown_.bind(this), false);
  }

  onKeyDown_(e) {
    // 39 = right
    // 37 = left
    if (e.keyCode == 82) {  // 'R'
      this.root.innerHTML = '';
      this.render();
    }
  }

  printMatchup_(rootNode) {
    return rootNode.gameState.state.playerHealth + ' hp ' +
        rootNode.gameState.state.playerDeck +
        ' vs ' +
        rootNode.gameState.state.enemyHealth + ' hp ' +
        rootNode.gameState.state.enemyDeck;
  }

  getStats_(rootNode) {
    let nodes = 0;
    let solved = 0;

    function calcWinRate(node) {
      nodes++;
      if (node.result || (node.parent && node.parent.solved)) {
        node.solved = true;
        solved++;
      }

      let result;
      if (!node.children || !node.children.length) {
        if (node.wins == 0) result = 0;
        else if (node.wins == Infinity) result = 1;
        else result = node.wins / (node.wins + node.losses);
      } else if (node.children[0].type == 'chance') {
        let count = 0;
        let total = 0;
        node.children.forEach(child => {
          const weight = child.weight || 1;
          total += calcWinRate(child) * weight;
          count += child.weight;
        });
        result = total / count;
      } else {
        result = _.max(_.map(node.children, calcWinRate));
      }
      //node.winRate = result;
      return result;
    }

    const result = calcWinRate(rootNode);
    return {winRate: _.decimals(result * 100, 1),
            solved: _.decimals(100 * solved / nodes, 1),
            best: _.decimals(rootNode.bestResult * 100, 1),
            worst: _.decimals(rootNode.worstResult * 100, 1),
            expected: _.decimals(rootNode.expectedResult * 100, 1),
            nodes};
  }

  render() {
    const playerDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const enemyDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const iterations = 5000;
    //const playerDeck = [1, 1, 1, 2];
    //const enemyDeck = [1, 1, 2, 3];
    const start = Date.now();
    const rootNode = MctsRunner.run(playerDeck, enemyDeck,
                                    {iteration: iterations});
    const time = Date.now() - start;

    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    const stats = this.getStats_(rootNode);
    subTitle.innerText = `${iterations - MctsRunner.mcts.iteration} ` +
        `iterations - ` +
        `${time}ms - ` +
        `win rate: ${stats.winRate}% - ` +
        `expected: ${stats.expected}% - ` +
        `best: ${stats.best}% - ` +
        `worst: ${stats.worst}% - ` +
        `solved: ${stats.solved}% - ` +
        `nodes: ${stats.nodes}`;

    const gameTreeElement = document.createElement('div');
    this.root.appendChild(gameTreeElement);
    const gameTree = new GameTree(gameTreeElement);
    gameTree.rootNode = rootNode;
    gameTree.render();
  }
}
