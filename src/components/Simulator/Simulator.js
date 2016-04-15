import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Button from 'react-toolbox/lib/button';
import { Card, CardText, CardActions, CardTitle } from 'react-toolbox/lib/card';
import style from './Simulator.scss';
import SolverFactory from '../../lib/solver-factory';
import gameData from '../../lib/game-engine/game-data';
import _ from '../../utils/common';

import GameStateEvaluator from '../../lib/evaluation/game-state-evaluator';

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
    return {
      player: {
        //name: 'Chump',
        //name: 'Apprentice',
        name: 'Cartomancer',
        //items: [],
        items: ['Shimmering Cloak'],
        traits: ['Crones Discipline'],
        //traits: [],
        level: 2,
      },
      enemy: {
        name: 'Rat King',
        //name: 'Gray Ooze',
        traits: ['Leader x3'],
      },
      result: 0,
      running: false,
    };
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
          {this.renderInput_('Trinkets, Level', 'player', 'traits',
                             playerTraits, {multiple: true})}
          {this.renderInput_('Enemy', 'enemy', 'name', enemies)}
          {this.renderInput_('Enemy Traits', 'enemy', 'traits', enemyTraits,
                             {multiple: true})}
        </CardText>
        <CardActions className={style['card-actions']}>
          {this.state.running ? (
            <Button label="Stop (this may take a while...)"
                    onClick={this.stopRunning_.bind(this)} />
          ) : this.state.result ? (
            <span>
              <span className={style['win-rate']}>{this.renderWinRate_()}</span>
              <Button label="See Breakdown"
                      onClick={this.openPlaythrough_.bind(this)} />
            </span>
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
        result: 0,
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
    };
    window.winners = {
    };
    window.hints = {};
    this.solver_ = new SolverFactory().create(
        this.state.player, this.state.enemy);
    this.incrementSolve_(2);
    this.time_ = Date.now();
    this.props.onSimulationStart({
      player: this.state.player,
      enemy: this.state.enemy,
      solver: this.solver_,
    });
    this.setState({result: 0, running: true});

    setTimeout(this.solveLoop_.bind(this), 5);
  }

  solveLoop_() {
    const a = performance.now();
    this.incrementSolve_(20000);
    const b = performance.now();
    window.stats.total += b - a;
    const result = this.solver_.rootNode.result;
    if (result) {
      console.log('STATS:', window.stats.total);
      //console.log('WINNERS:', window.winners);
      //_.each(window.winners, (v, hash) => {
      //  if (v.wins &&
      //      v.wins / v.losses > 300 &&
      //      v.wins / v.meh > 50) {
      //    console.log('Winner:', hash, v.wins, v.losses, v.meh);
      //  }
      //  if (v.losses &&
      //      v.losses / v.wins > 300 &&
      //      v.losses / v.meh > 50) {
      //    console.log('Loser:', hash, v.wins, v.losses, v.meh);
      //  }
      //});
      //console.log('HINTS:', window.hints);
      //_.each(window.hints, (v, hash) => {
      //  console.log(hash, '->', v);
      //});

      this.time_ = Date.now() - this.time_;
      this.setState({result, running: false});
      this.props.onSimulationFinish();
    } else if (this.state.running) {
      setTimeout(this.solveLoop_.bind(this), 5);
    }
  }

  incrementSolve_(iterations) {
    for (let i = 0; i < iterations && !this.solver_.rootNode.result; i++) {
      this.solver_.next();
    }
  }

  stopRunning_() {
    this.setState({running: false});
  }

  renderWinRate_() {
    const percent = _.percent(this.state.result) + '%';
    return (
      <span>
        win rate: <span className={style.percent}>{percent}</span> ({this.time_ / 1000}s)
      </span>
    );
  }

  openPlaythrough_() {
    this.props.openPlaythrough();
  }
}
