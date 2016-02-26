import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Button from 'react-toolbox/lib/button';
import { Card, CardText, CardActions, CardTitle } from 'react-toolbox/lib/card';
import style from './Simulator.scss';
import GodSolverFactory from '../../ai/god-solver-factory';
import gameData from '../../ai/game-data';
import _ from '../../utils/common';

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
        name: 'Cat Burglar',
        items: [],
        traits: [],
        level: 0,
      },
      enemy: {
        name: 'Rat King',
        traits: [],
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
    const {players, enemies, items} = this.renderInfo_;
    const playerTraits = this.filterTraits_(
        this.renderInfo_.playerTraits, this.state.player.traits);
    const enemyTraits = this.filterTraits_(
        this.renderInfo_.enemyTraits, this.state.enemy.traits);

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
            <Button label="Stop"
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
            <ProgressBar type="linear" mode="indeterminate" />) : ''}
      </Card>
    );
  }

  // Removes traits of the same type, e.g. can't select a level twice.
  filterTraits_(traits, selected) {
    const types = _.createSet(selected.map((trait) => {
      return gameData.traits[trait].type;
    }));
    return traits.filter((trait) => {
      if (selected.includes(trait)) return true;
      const type = gameData.traits[trait].type;
      return !type || !types[type];
    });
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
    this.solver_ = new GodSolverFactory().create(
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
    this.incrementSolve_(20000);
    const result = this.solver_.rootNode.result;
    if (result) {
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
