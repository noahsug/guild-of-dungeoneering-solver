import React, { PropTypes, Component } from 'react';
import {Typeahead, Tokenizer} from 'react-typeahead';
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
  }

  static propTypes = {
    onSimulationStart: React.PropTypes.func,
    onSimulationFinish: React.PropTypes.func,
  }

  getInitialState_() {
    return {
      player: {
        name: 'Chump',
        items: [],
        traits: [],
        level: 0,
      },
      enemy: {
        name: 'Fire Imp',
        traits: [],
      },
      result: 0,
      running: false,
    };
  }

  parseGameData_() {
    const players = ['Chump'];
    const enemies = [];
    _.each(gameData.players, (p, name) => {
      if (!p.player) enemies.push(name);
    });
    const items = Object.keys(gameData.items);
    const traits = ['+1HP', '+2HP', '+3HP', '+4HP', '+5HP',
                    '-1HP', '-2HP', '-3HP', '-4HP', '-5HP'];
    return {players, enemies, items, traits};
  }

  render() {
    const {players, enemies, items, traits} = this.renderInfo_;

    return (
      <Card className={style.content}>
        <CardText>
          {this.renderInput_('Hero', 'player', 'name', players)}
          {this.renderInput_('Items', 'player', 'items', items, {multiple: true})}
          {this.renderInput_('Trinkets, Level', 'player', 'traits', traits,
                             {multiple: true})}
          {this.renderInput_('Enemy', 'enemy', 'name', enemies)}
          {this.renderInput_('Traits', 'enemy', 'traits', traits,
                             {multiple: true})}
        </CardText>
        {this.state.running ? (
          <ProgressBar type="linear" mode="indeterminate" />
        ) : this.state.result ? (
          <CardActions className={style['card-actions']}>
            <span className={style['win-rate']}>{this.renderWinRate_()}</span>
          </CardActions>
        ) : (
          <CardActions className={style['card-actions']}>
            <Button primary label="Solve" onClick={this.solve_.bind(this)} />
          </CardActions>
        )}
      </Card>
    );
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
    this.props.onSimulationStart({
      player: this.state.player,
      enemy: this.state.enemy,
      rootNode: this.solver_.rootNode,
    });
    this.setState({result: 0, running: true});

    setTimeout(this.solveLoop_.bind(this), 5);
  }

  solveLoop_() {
    this.incrementSolve_(20000);
    const result = this.solver_.rootNode.result;
    if (result) {
      this.setState({result, running: false});
      this.props.onSimulationFinish();
    } else {
      setTimeout(this.solveLoop_.bind(this), 5);
    }
  }

  incrementSolve_(iterations) {
    for (let i = 0; i < iterations && !this.solver_.rootNode.result; i++) {
      this.solver_.next();
    }
  }

  renderWinRate_() {
    const result = this.state.result;
    const percent = _.decimals(100 * (result == -1 ? 0 : result), 2) + '%';
    return (
      <span>
        win rate: <span className={style.percent}>{percent}</span>
      </span>
    );
  }
}
