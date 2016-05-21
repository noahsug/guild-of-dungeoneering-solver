import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Button from 'react-toolbox/lib/button';
import { Card, CardText, CardActions, CardTitle } from 'react-toolbox/lib/card';
import style from './Simulator.scss';
import SolverFactory from '../../lib/solver-factory';
import Node from '../../lib/tree-search/node';
import gameData from '../../lib/game-engine/game-data';
import _ from '../../utils/common';

import FastSolver from '../../lib/fast-search/fast-solver';

//import GameStateEvaluator from '../../lib/evaluation/game-state-evaluator';

export default class Simulator extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState_();
    this.renderInfo_ = this.parseGameData_();
    this.solver_ = null;
    this.time_ = 0;
  }

  static propTypes = {
    onSimulationStart: React.PropTypes.func,
    onSimulationFinish: React.PropTypes.func,
    openPlaythrough: React.PropTypes.func,
  }

  getInitialState_() {
    //return {
    //  player: {name: 'Chump', items: [], traits: ['Crones Discipline']},
    //  enemy: {name: 'Gray Ooze', traits: []},
    //};

    //return {
    //  player: {name: 'Chump', items: [], traits: []},
    //  enemy: {name: 'Embro', traits: []},
    //};

    //return {
    //  player: {name: 'Apprentice', items: ['Shimmering Cloak'], traits: []},
    //  enemy: {name: 'Ghost', traits: []},
    //};

    //return {
    //  player: {name: 'Apprentice', items: [], traits: []},
    //  enemy: {name: 'Giant Crab', traits: []},
    //};

    return {
      player: {
        name: 'Cartomancer',
        items: ['Conch', 'Shimmering Cloak', 'Mail Coif', 'Net'],
        traits: [],
      },
      enemy: {name: 'Angry Bunny', traits: []},
    };

    //return {
    //  player: {
    //    name: 'Apprentice',
    //    items: ['Shimmering Cloak', 'Straightjacket', 'Ruffled Shirt'],
    //    traits: ['Level 3'],
    //  },
    //  enemy: {name: 'Embro', traits: []},
    //};
    //
    //return {
    //  player: {
    //    name: 'Chump',
    //    items: [],
    //    traits: [],
    //  },
    //  enemy: {
    //    name: 'Gray Ooze',
    //    traits: [],
    //  },
    //  result: undefined,
    //  running: false,
    //};
  }

  parseGameData_() {
    const players = [];
    _.each(gameData.players, (player, name) => {
      players.push(name);
    });
    const enemies = [];
    _.each(gameData.enemies, (enemy, name) => {
      enemies.push(name);
    });
    const items = Object.keys(gameData.items);
    const playerTraits = [];
    _.each(gameData.traits, (trait, name) => {
      if (trait.for == 'player') playerTraits.push(name);
    });
    const enemyTraits = [];
    _.each(gameData.traits, (trait, name) => {
      if (trait.for == 'enemy') enemyTraits.push(name);
    });
    return {players, enemies, items, playerTraits, enemyTraits};
  }

  render() {
    //const evaluator = new GameStateEvaluator();
    //evaluator.evaluate(this.state.player, this.state.enemy);

    const {players, enemies, items} = this.renderInfo_;
    const playerTraits = this.filterTraits_(
        this.renderInfo_.playerTraits, this.state.player);
    const enemyTraits = this.filterTraits_(
        this.renderInfo_.enemyTraits, this.state.enemy);

    return (
      <Card className={style.content}>
        <CardText>
          {this.renderInput_('Dungeoneer', 'player', 'name', players)}
          {this.renderInput_('Items', 'player', 'items', items,
                             {multiple: true})}
          {this.renderInput_('Trinkets, Level, Battle Scars',
                             'player', 'traits',
                             playerTraits, {multiple: true})}
          {this.renderInput_('Enemy', 'enemy', 'name', enemies)}
          {this.renderInput_('Enemy Traits', 'enemy', 'traits', enemyTraits,
                             {multiple: true})}
        </CardText>
        <CardActions className={style['card-actions']}>
          {this.state.result != undefined ? (
            <span className={style['win-rate']}>{this.renderWinRate_()}</span>
          ) : ''}
          {this.state.running ? (
            <Button label="Stop" onClick={this.finishedSolving_.bind(this)} />
          ) : this.state.result != undefined ? (
            <Button label="See Breakdown"
                onClick={this.openPlaythrough_.bind(this)} />
          ) : (
            <Button primary label="Solve" onClick={this.solve_.bind(this)} />
          )}
        </CardActions>
        {this.state.running ? (
          <ProgressBar type="linear" mode="indeterminate" />
        ) : ''}
      </Card>
    );
  }

  // Removes traits of the same type, e.g. can't select a level twice.
  filterTraits_(traits, selected) {
    const types = _.createSet(selected.traits.map((trait) => {
      return gameData.traits[trait].type;
    }));
    traits = traits.filter((trait) => {
      if (selected.traits.includes(trait)) return true;
      const type = gameData.traits[trait].type;
      return !type || !types[type];
    });
    if (selected.name) {
      const player = gameData.players[selected.name] ||
            gameData.enemies[selected.name];
      traits = traits.concat(player.situationalTraits || []);
    }
    return traits;
  }

  renderInput_(label, player, type, source, {multiple = false} = {}) {
    return (
      <Autocomplete className={style.autocomplete}
                    label={label}
                    source={source}
                    multiple={multiple}
                    value={this.state[player][type]}
                    onChange={onChange.bind(this)} />
    );

    function onChange(newValue) {
      const newState = {[type]: newValue};
      this.setState({
        [player]: _.defaults(newState, this.state[player]),
        result: undefined,
      });
    }
  }

  onInputChange_(player, valueName, value) {
    const newState = {[valueName]: value};
    this.setState({[player]: _.defaults(newState, this.state[player])});
  }

  solve_() {
    window.stats = {
      total: 0,
      hash: 0,
      hand: 0,
      hand2: 0,
      resolve: 0,
      move: 0,
      next: 0,
      search: 0,
      result: 0,
      worst: 0,
      best: 0,
    };

    _.time('total');
    const fastSolver = new FastSolver();
    fastSolver.init(this.state.player, this.state.enemy);
    for (let i = 1; i <= 2000; i++) {
      fastSolver.next();
      if (i % 500 == 0) console.log(fastSolver.result);
    }
    window.stats.total = _.time('total');
    console.log(window.stats);

    //this.solver_ = new SolverFactory().create(
    //  this.state.player, this.state.enemy);
    //this.solver_.solve(2);
    //this.time_ = Date.now();
    //this.props.onSimulationStart({
    //  player: this.state.player,
    //  enemy: this.state.enemy,
    //  solver: this.solver_,
    //});
    //this.setState({result: undefined, running: true});
    //
    //setTimeout(this.solveLoop_.bind(this), 5);
  }

  solveLoop_() {
    const a = performance.now();
    this.solver_.solve(30000);
    const b = performance.now();
    window.stats.total += b - a;
    let result = this.solver_.rootNode.result;
    if (result) {
      this.setState({result});
      if (this.solver_.accuracy == 1) {
        result = this.improveAccuracy_();
      } else {
        this.finishedSolving_();
      }
    } else if (this.state.running) {
      setTimeout(this.solveLoop_.bind(this), 1);
    }
  }

  finishedSolving_() {
    console.log('STATS:', window.stats);
    this.time_ = Date.now() - this.time_;
    this.setState({running: false});
    if (this.state.result != undefined) {
      this.props.onSimulationFinish();
    }
  }

  improveAccuracy_() {
    const initRootNode = this.solver_.rootNode;
    const initResult = initRootNode.result;
    const children = this.getBestChildren_(initRootNode, 15);
    if (children.length == 0) {
      this.finishedSolving_();
      return;
    }

    let count = 0;
    let error = 0;
    let index = 0;
    const next = () => {
      const bestChild = children[index++];
      if (bestChild.result < 0) return;
      const improvedChanceResult = this.solveNode_(bestChild);
      let playerNode = this.getBestChildren_(this.solver_.rootNode, 1)[0];
      const bestChanceNodes = this.getBestChildren_(playerNode, 8);
      playerNode = playerNode || {};
      let avg = 0;
      let count2 = 0;
      const next2 = () => {
        if (!this.state.running) return;

        if (count2 < bestChanceNodes.length) {
          const child = bestChanceNodes[count2++];
          const result = this.solveNode_(child);
          avg += result;
          this.solver_.rootNode = initRootNode;
          setTimeout(next2, 5);
          return;
        }

        playerNode.result = avg / (count2 || 1) || -1;
        if (playerNode.result < bestChild.result) {
          count++;
          error += _.minZero(playerNode.result) / bestChild.result;
          bestChild.result = playerNode.result;
          initRootNode.result = initResult * error / count || -1;
          this.setState({result: _.minZero(initRootNode.result)});
        }

        if (index < children.length) {
          this.solver_.rootNode = initRootNode;
          setTimeout(next, 5);
        } else {
          this.solver_.rootNode = initRootNode;
          this.finishedSolving_();
        }
      };
      this.solver_.rootNode = initRootNode;
      setTimeout(next2, 5);
    };
    next();
  }

  getBestChildren_(node, n, sampleRatio = 1) {
    if (!node) return [];
    let children = node.children ||
        this.solver_.nodeFactory.createChildren(node);
    if (node.type != Node.Type.CHANCE) {
      children = _.uniq(children, false, _.iteratee('id'));
    }
    return _.chain(children)
        .filter((c) => c.result > 0)
        .sortBy(_.iteratee('result'))
        .reverse()
        .first(n)
        .sample(Math.ceil(n * sampleRatio))
        .value();
  }

  solveNode_(node) {
    this.solver_.clearCache();
    this.solver_.setState(node.state);
    this.solver_.solve();
    return _.minZero(this.solver_.rootNode.result);
  }

  renderWinRate_() {
    const percent = _.percent(this.state.result) + '%';
    return (
      <span>
        win rate: <span className={style.percent}>{percent}</span>
        {!this.state.running ? ' (' + this.time_ / 1000 + 's)' : ''}
      </span>
    );
  }

  openPlaythrough_() {
    this.props.openPlaythrough();
  }

  componentDidMount() {
    window.onkeydown = (e) => {
      if (e.code == 'Enter') this.solve_();
    };
  }
}
