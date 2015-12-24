import './App.scss';
import GameTree from '../GameTree';
import GameplayView from '../GameplayView';
import GodSolverFactory from '../../ai/god-solver-factory';
import Card from '../../ai/card';
import Node from '../../ai/node';
import results from '../../ai/results';
import gameData from '../../ai/game-data';
import ResultAccessor from '../../ai/result-accessor';
import _ from '../../utils/common';

export default class App {
  constructor(root) {
    this.root = root;
    root.classList.add('App');
    window.addEventListener('keydown', this.onKeyDown_.bind(this), false);

    const grasslands1 = ['Rubber Ducky', 'Fire Imp', 'Giant Bat', 'Goblin',
                         'Gray Ooze', 'Nasty Rat', 'Scary Spider'];
    const grasslands2 = ['Ghost', 'Gnoll', 'Mimic', 'Rat Man', 'Skeleton',
                         'Snake', 'Zombie'];
    const grasslands3 = ['Bandito', 'Bear Owl', 'Fire Elemental',
                         'Minotaur', 'Mummy', 'Scorpion', 'Shade', 'Sorceress'];
    const grasslands4 = ['Black knight', 'Embro', 'Lich', 'Eye Beast',
                         'Mimic Queen', 'Orc Warlord', 'Rat King'];

    const trinkets = ['Phlogis Tonic', 'Warriors Might', 'Crones Discipline'];

    const c1Items = [];
    _.each(gameData.items, (i, name) => {
      if (i.rarity == 'C1') c1Items.push(name);
    });

    //this.traits = trinkets;
    this.traits = [];
    this.traitIndex = 1;

    this.items = c1Items;
    //this.items = ['Ruffled Shirt'];
    this.itemIndex = 1;

    //this.enemies = grasslands1.concat(grasslands2).concat(grasslands3).concat(grasslands4);
    this.enemies = grasslands1.concat(grasslands2).concat(['Rat King']);//.concat(grasslands3).concat(['Rat King']);
    //this.enemies = ['Scary Spider'];
    this.enemyIndex = 0;

    this.player = {
      name: 'Chump',
      sets: [],
      traits: this.traits[0] ? [this.traits[0]] : [],
      items: this.items[0] ? [this.items[0]] : []};

    this.iterations = 15000000;
    //this.debug = true;
    //this.showGameView = true;
    //this.showTree = true;
    this.showResults = true;

    this.nextEnemy_();
  }

  nextEnemy_() {
    if (this.enemyIndex >= this.enemies.length) {
      if (this.traitIndex >= this.traits.length) {
        if (this.itemIndex >= this.items.length) {
          return false;
        }
        this.player.items = [this.items[this.itemIndex]];
        this.itemIndex++;
        this.traitIndex = 0;
      }
      if (this.traits[this.traitIndex]) {
        this.player.traits = [this.traits[this.traitIndex]];
      }
      this.traitIndex++;
      this.enemyIndex = 0;
    }
    this.enemy = {name: this.enemies[this.enemyIndex]};
    this.enemyIndex++;
    return true;
  }

  onKeyDown_(e) {
    // 39 = right
    // 37 = left
    if (e.keyCode == 82) {  // 'R'
      this.root.innerHTML = '';
      this.render();
    }

    if (e.keyCode == 80) {  // 'P'
      this.paused = !this.paused;
    }
  }

  render() {
    if (this.paused) {
      setTimeout(this.render.bind(this), 500);
      return;
    }

    const solver = new GodSolverFactory().create(
        this.player, this.enemy,
        {iteration: this.iterations, debug: this.debug});
    const start = Date.now();
    this.increment_(solver, start);
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

  increment_(solver, start) {
    const time = Date.now() - start;
    if (solver.done) {
      this.maybeSaveResult_(solver.rootNode.resul);
      if (this.nextEnemy_()) {
        setTimeout(() => this.render(), 30);
      } else {
        this.renderResult_(solver, time);
      }
    } else {
      this.root.innerHTML = this.printMatchup_(solver.rootNode) +
          ' - Win Rate: ' + this.percent_(solver.rootNode.winRate) +
          ' - Iteraiton: ' + (this.iterations - solver.iteration);
      //this.renderIncrementalResult_(solver, time);
      for (let i = 0; i < 10000 && !solver.done; i++) {
        solver.next();
      }
      setTimeout(this.increment_.bind(this, solver, start), 30);
    }
  }

  renderIncrementalResult_(solver, time) {
    this.root.innerHTML = '';
    const rootNode = solver.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    this.addStat_(subTitle, 'done',
                  `${this.percent_(1 - solver.iteration / this.iterations)}%`);
    this.addStat_(subTitle, 'iteration', this.iterations - solver.iteration);
    this.addStat_(subTitle, 'time', `${_.decimals(time / 1000, 1)}s`);
    this.addStat_(subTitle, 'win rate',
                  `${this.percent_(rootNode.winRate)}%`);
  }

  renderResult_(solver, time) {
    this.root.innerHTML = '';
    const rootNode = solver.rootNode;
    const title = document.createElement('h1');
    this.root.appendChild(title);
    title.innerText = this.printMatchup_(rootNode);

    const subTitle = document.createElement('h3');
    this.root.appendChild(subTitle);
    const counts = this.countNodes_(rootNode);
    this.addStat_(
        subTitle, 'iteration', `${this.iterations - solver.iteration}`);
    this.addStat_(subTitle, 'time', `${_.decimals(time / 1000, 1)}s`);
    this.addStat_(subTitle, 'win rate',
                  `${this.percent_(rootNode.winRate)}%`);
    if (!rootNode.result) {
      this.addStat_(subTitle, 'nodes', counts.nodes);
      const solved = counts.solved / counts.nodes;
      this.addStat_(subTitle, 'solved',
                    _.decimals(100 * solved, 5) + '%');
      this.addStat_(subTitle, 'to solve', this.printTime_(time / solved));
    }

    if (this.showGameView) {
      const gameplayElement = document.createElement('div');
      this.root.appendChild(gameplayElement);
      const gameplayView = new GameplayView(gameplayElement);
      gameplayView.rootNode = rootNode;
      gameplayView.render();
    }

    if (this.showTree) {
      const gameTreeElement = document.createElement('div');
      this.root.appendChild(gameTreeElement);
      const gameTree = new GameTree(gameTreeElement);
      gameTree.rootNode = rootNode;
      gameTree.render();
    }

    if (this.showResults) {
      this.root.appendChild(this.renderAllResults_(rootNode.result));
    }
  }

  printMatchup_(rootNode) {
    return this.player.name + ' - ' +
        this.player.items.join(', ') + ' ' +
        this.player.traits.join(', ') + ' ' +
        rootNode.gameState.state.playerHealth + ' hp ' +
        this.printCards_(rootNode.gameState.state.playerDeck) +
        ' vs ' +
        this.enemy.name + ' - ' +
        rootNode.gameState.state.enemyHealth + ' hp ' +
        this.printCards_(rootNode.gameState.state.enemyDeck);
  }

  printCards_(cards) {
    return cards.map(c => Card.list[c].desc).join(', ');
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

  maybeSaveResult_(result) {
    if (result) {
      new ResultAccessor().save(this.player, this.enemy, result);
    } else {
      console.error('NO RESULT FOR', this.enemy.name, ':',
                    JSON.strinify(this.player, null, 2),
                    JSON.strinify(this.enemy, null, 2));
    }
  }

  renderAllResults_(result) {
    const container = document.createElement('textarea');
    container.setAttribute('cols', 100);
    container.setAttribute('rows', 15);
    container.innerHTML = JSON.stringify(results, null, 2);
    console.log(JSON.stringify(results, null, 2));
    return container;
  }
}
