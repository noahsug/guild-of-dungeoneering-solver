import './App.scss';
import GameTree from '../GameTree';
import GameplayView from '../GameplayView';
import MctsRunner from '../../ai/mcts-runner';
import Card from '../../ai/card';
import Node from '../../ai/node';
import _ from '../../utils/common';

export default class App {
  constructor(root) {
    this.root = root;
    root.classList.add('App');
    window.addEventListener('keydown', this.onKeyDown_.bind(this), false);

    this.player = 'Chump';
    this.enemy = 'Gray Ooze';
  }

  onKeyDown_(e) {
    // 39 = right
    // 37 = left
    if (e.keyCode == 82) {  // 'R'
      this.root.innerHTML = '';
      this.render();
    }
  }

  render() {
    const iterations = 1100000;
    //const iterations = 1000;
    const r = [0.5, 0.8, 0.7, 0.1, 0.2, 0.9,
               0.4, 0.999999, 0.6, 0.3, 0.0000001];
    let ri = 0;
    Math.random = () => {
      const result = r[ri];
      ri = (ri + 1) % r.length;
      return result;
    };
    const mcts = MctsRunner.run(
        this.player, this.enemy, {iteration: iterations});
    const start = Date.now();
    this.increment_(mcts, start, iterations);
  }

  increment_(mcts, start, iterations) {
    const time = Date.now() - start;
    if (mcts.done) {
      this.renderResult_(mcts, time, iterations);
    } else {
      this.renderIncrementalResult_(mcts, time, iterations);
      for (let i = 0; i < 5000 && !mcts.done; i++) {
        mcts.next();
      }
      setTimeout(this.increment_.bind(this, mcts, start, iterations), 100);
    }
  }

  renderIncrementalResult_(mcts, time, iterations) {
    this.root.innerHTML = '';
    const rootNode = mcts.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    this.addStat_(subTitle, 'done',
                  `${this.percent_(1 - mcts.iteration / iterations)}%`);
    this.addStat_(subTitle, 'iteration', iterations - mcts.iteration);
    this.addStat_(subTitle, 'time', time + 'ms');
    if (rootNode.expectedResult) {
      this.addStat_(subTitle, 'expected',
                    `${this.percent_(rootNode.expectedResult)}%`);
      this.addStat_(subTitle, 'best',
                    `${this.percent_(rootNode.bestResult)}%`);
      this.addStat_(subTitle, 'worst',
                    `${this.percent_(rootNode.worstResult)}%`);
    }
    this.addStat_(subTitle, 'wins', rootNode.wins);
    this.addStat_(subTitle, 'losses', rootNode.losses);
  }

  renderResult_(mcts, time, iterations) {
    this.root.innerHTML = '';
    const rootNode = mcts.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    const stats = this.getStats_(rootNode);
    this.addStat_(subTitle, 'iteration', `${iterations - mcts.iteration}`);
    this.addStat_(subTitle, 'time', `${time}ms`);
    this.addStat_(subTitle, 'win rate', stats.winRate + '%');
    if (stats.solved) {
      this.addStat_(subTitle, 'solved', stats.solved + '%');
    }
    if (stats.expected) {
      this.addStat_(subTitle, 'expected', `${stats.expected}%`);
      this.addStat_(subTitle, 'best', `${stats.best}%`);
      this.addStat_(subTitle, 'worst', `${stats.worst}%`);
    }
    this.addStat_(subTitle, 'nodes', stats.nodes);

    //const gameplayElement = document.createElement('div');
    //this.root.appendChild(gameplayElement);
    //const gameplayView = new GameplayView(gameplayElement);
    //gameplayView.rootNode = rootNode;
    //gameplayView.render();
    //
    //const gameTreeElement = document.createElement('div');
    //this.root.appendChild(gameTreeElement);
    //const gameTree = new GameTree(gameTreeElement);
    //gameTree.rootNode = rootNode;
    //gameTree.render();
  }

  printMatchup_(rootNode) {
    return this.player + ' ' +
        rootNode.gameState.state.playerHealth + ' hp ' +
        this.printCards_(rootNode.gameState.state.playerDeck) +
        ' vs ' +
        this.enemy + ' ' +
        rootNode.gameState.state.enemyHealth + ' hp ' +
        this.printCards_(rootNode.gameState.state.enemyDeck);
  }

  printCards_(cards) {
    return cards.map(c => Card.list[c].desc);
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
      } else if (node.children[0].type == Node.Type.CHANCE) {
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
    const stats = {winRate: this.percent_(result), nodes};
    if (!rootNode.solved) {
      _.extend(stats, {
        solved: _.decimals(100 * solved / nodes, 5),
      });
    }
    if (rootNode.expectedResult) {
      _.extend(stats, {
        expected: this.percent_(rootNode.expectedResult),
        best: this.percent_(rootNode.bestResult),
        worst: this.percent_(rootNode.worstResult),
      });
    }
    return stats;
  }

  percent_(ratio) {
    return _.decimals(ratio * 100, 2);
  }

  addStat_(container, name, value) {
    const stat = document.createElement('span');
    stat.classList.add('stat');
    stat.innerText = `${name}: ${value}`;
    container.appendChild(stat);
  }
}
