import './App.scss';
import GameTree from '../GameTree';
import GameplayView from '../GameplayView';
import GodSolverFactory from '../../ai/god-solver-factory';
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
    const iterations = 500000;
    const solver = new GodSolverFactory().create(
        this.player, this.enemy, {iteration: iterations});
    const start = Date.now();
    this.increment_(solver, start, iterations);
  }

  mockRandom_() {
    const r = [0.5, 0.8, 0.7, 0.1, 0.2, 0.9,
               0.4, 0.999999, 0.6, 0.3, 0.0000001];
    let ri = 0;
    Math.random = () => {
      const result = r[ri];
      ri = (ri + 1) % r.length;
      return result;
    };
  }

  increment_(solver, start, iterations) {
    const time = Date.now() - start;
    if (solver.done) {
      this.renderResult_(solver, time, iterations);
    } else {
      this.renderIncrementalResult_(solver, time, iterations);
      for (let i = 0; i < 10000 && !solver.done; i++) {
        solver.next();
      }
      setTimeout(this.increment_.bind(this, solver, start, iterations), 30);
    }
  }

  renderIncrementalResult_(solver, time, iterations) {
    this.root.innerHTML = '';
    const rootNode = solver.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    this.addStat_(subTitle, 'done',
                  `${this.percent_(1 - solver.iteration / iterations)}%`);
    this.addStat_(subTitle, 'iteration', iterations - solver.iteration);
    this.addStat_(subTitle, 'time', time + 'ms');
    this.addStat_(subTitle, 'win rate',
                  `${this.percent_(rootNode.winRate)}%`);
  }

  renderResult_(solver, time, iterations) {
    this.root.innerHTML = '';
    const rootNode = solver.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    const counts = this.countNodes_(rootNode);
    this.addStat_(subTitle, 'iteration', `${iterations - solver.iteration}`);
    this.addStat_(subTitle, 'time', `${time}ms`);
    this.addStat_(subTitle, 'win rate',
                  `${this.percent_(rootNode.winRate)}%`);
    if (!rootNode.result) {
      this.addStat_(subTitle, 'nodes', counts.nodes);
      const solved = counts.solved / counts.nodes;
      this.addStat_(subTitle, 'solved',
                    _.decimals(100 * solved, 5) + '%');
      this.addStat_(subTitle, 'to solve', this.printTime_(time / solved));
    }

    //const gameplayElement = document.createElement('div');
    //this.root.appendChild(gameplayElement);
    //const gameplayView = new GameplayView(gameplayElement);
    //gameplayView.rootNode = rootNode;
    //gameplayView.render();

    const gameTreeElement = document.createElement('div');
    this.root.appendChild(gameTreeElement);
    const gameTree = new GameTree(gameTreeElement);
    gameTree.rootNode = rootNode;
    gameTree.render();
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

  countNodes_(rootNode) {
    let nodes = 1;
    let solved = 0;
    function count(node) {
      if (node.result || !node.children) return;
      count(node.children[0]);
      nodes *= node.children.length;
      if (!solved) {
        const numChildrenWithResult = _.count(node.children, (c) => {
          return c.result;
        });
        solved = numChildrenWithResult;
      }
    }
    count(rootNode);
    return {nodes, solved};
  }

  percent_(ratio) {
    return _.decimals(ratio * 100, 2);
  }

  printTime_(ms) {
    if (ms < 1000) {
      return ms + 'ms';
    }
    ms /= 1000;
    if (ms < 60) {
      return _.decimals(ms, 1) + 's';
    }
    ms /= 60;
    if (ms < 60) {
      return _.decimals(ms, 1) + 'm';
    }
    ms /= 60;
    if (ms < 24) {
      return _.decimals(ms, 2) + 'h';
    }
    ms /= 24;
    return _.decimals(ms, 2) + 'd';
  }

  addStat_(container, name, value) {
    const stat = document.createElement('span');
    stat.classList.add('stat');
    stat.innerText = `${name}: ${value}`;
    container.appendChild(stat);
  }
}
