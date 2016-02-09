import React, { PropTypes, Component } from 'react';
import {Typeahead, Tokenizer} from 'react-typeahead';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import Button from 'react-toolbox/lib/button';
import style from './Simulator.scss';
import GodSolverFactory from '../../ai/god-solver-factory';
import Card from '../../ai/card';
import Node from '../../ai/node';
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
      iterations: 0,
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
    const renderBtn = this.simulationRunning_ ? <div /> :
        <button onClick={this.solve_.bind(this)}>Battle!</button>;
    return (
      <section className={style.content}>
        <Autocomplete label="Enemy"
                      source={enemies}
                      multiple={false}
                      value={this.state.enemy.name}
                      onChange={this.setName_.bind(this, 'enemy')} />

        <div className={style.player}>
          <div>
            <label>Hero</label>
            <Typeahead options={players}
                       value={this.state.player.name}
                       onOptionSelected={this.setName_.bind(this, 'player')}
            />
          </div>
          <div>
            <label>Player Items</label>
            <Tokenizer options={items}
                       onTokenAdd={this.addItem_.bind(this, 'player')}
                       onTokenRemove={this.removeItem_.bind(this, 'player')}
            />
          </div>
          <div>
            <label>Player Traits</label>
            <Tokenizer options={traits}
                       onTokenAdd={this.addTrait_.bind(this, 'player')}
                       onTokenRemove={this.removeTrait_.bind(this, 'player')}
            />
          </div>
        </div>

        <div className={style.player}>
          <div>
            <label>Enemy</label>
            <Typeahead options={enemies}
                       value={this.state.enemy.name}
                       onOptionSelected={this.setName_.bind(this, 'enemy')}
            />
          </div>
          <div>
            <label>Enemy Traits</label>
            <Tokenizer options={traits}
                       onTokenAdd={this.addTrait_.bind(this, 'enemy')}
                       onTokenRemove={this.removeTrait_.bind(this, 'enemy')}
            />
          </div>
        </div>
        <div className={style.result}>
          <label>Win rate: {this.printResult_()}</label>
          {renderBtn}
        </div>
      </section>
    );
  }

  get simulationRunning_() {
    return !this.state.result && this.state.iterations;
  }

  setName_(player, name) {
    this.setState({[player]: _.defaults({name}, this.state[player])});
  }

  addItem_(player, item) {
    const items = this.state[player].items.concat([item]);
    this.setState({[player]: _.defaults({items}, this.state[player])});
  }

  removeItem_(player, item) {
    const items = _.remove(this.state[player].items, item);
    this.setState({[player]: _.defaults({items}, this.state[player])});
  }

  addTrait_(player, trait) {
    const traits = this.state[player].traits.concat([trait]);
    this.setState({[player]: _.defaults({traits}, this.state[player])});
  }

  removeTrait_(player, trait) {
    const traits = _.remove(this.state[player].traits, trait);
    this.setState({[player]: _.defaults({traits}, this.state[player])});
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
    this.setState({iterations: 0, result: 0});

    setTimeout(this.solveLoop_.bind(this), 5);
  }

  solveLoop_() {
    this.incrementSolve_(20000);
    const result = this.solver_.rootNode.result;
    if (result) {
      this.setState({result});
      this.props.onSimulationFinish();
    } else {
      const iterations =
          this.solver_.runUntil.iteration - this.solver_.iteration;
      this.setState({iterations});
      setTimeout(this.solveLoop_.bind(this), 5);
    }
  }

  incrementSolve_(iterations) {
    for (let i = 0; i < iterations && !this.solver_.rootNode.result; i++) {
      this.solver_.next();
    }
  }

  printResult_() {
    if (!this.state.result) return this.state.iterations || '';
    const result = this.state.result;
    return _.decimals(result == -1 ? 0 : result, 4);
  }
}
