import React, { PropTypes, Component } from 'react';
import './Scenario.scss';
import {Typeahead, Tokenizer} from 'react-typeahead';
import GodSolverFactory from '../../ai/god-solver-factory';
import Card from '../../ai/card';
import Node from '../../ai/node';
import ResultAccessor from '../../ai/result-accessor';
import results from '../../ai/results';
import gameData from '../../ai/game-data';
import _ from '../../utils/common';

export default class Scenario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {
        name: 'Chump',
        items: [],
        traits: [],
      },
      enemy: {
        name: 'Fire Imp',
        traits: [],
      },
      result: null,
    };
  }

  static propTypes = {
    resultUpdated: React.PropTypes.func,
  }

  render() {
    const enemies = [];
    _.each(gameData.players, (p, name) => {
      if (!p.player) enemies.push(name);
    });
    const items = Object.keys(gameData.items);
    const traits = ['+1HP', '+2HP', '+3HP', '+4HP', '+5HP',
                    '-1HP', '-2HP', '-3HP', '-4HP', '-5HP'];

    return (
      <div className="Scenario">
        <div className="player">
          <div>
            <label>Player Name</label>
            <Typeahead options={['Chump']}
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

        <div className="player">
          <div>
            <label>Enemy Name</label>
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
        <div className="result">
          <label>Result: {this.state.result}</label>
          <button onClick={this.getResult_.bind(this)}>Get Result</button>
        </div>
      </div>
    );
  }

  setName_(player, name) {
    const nextState = {result: 0};
    nextState[player] = _.defaults({name}, this.state[player]);
    this.setState(nextState);
  }

  addItem_(player, item) {
    const items = (this.state[player].items || []).concat([item]);

    const nextState = {result: 0};
    nextState[player] = _.defaults({items}, this.state[player]);
    this.setState(nextState);
  }

  removeItem_(player, item) {
    const items = _.remove(this.state[player].items, item);

    const nextState = {result: 0};
    nextState[player] = _.defaults({items}, this.state[player]);
    this.setState(nextState);
  }

  addTrait_(player, trait) {
    const traits = (this.state[player].traits || []).concat([trait]);

    const nextState = {result: 0};
    nextState[player] = _.defaults({traits}, this.state[player]);
    this.setState(nextState);
  }

  removeTrait_(player, trait) {
    const traits = _.remove(this.state[player].traits, trait);

    const nextState = {result: 0};
    nextState[player] = _.defaults({traits}, this.state[player]);
    this.setState(nextState);
  }

  getResult_() {
    const result = new ResultAccessor().get(
        this.state.player, this.state.enemy);
    if (result) {
      this.setResult_(result);
    } else {
      const solver = new GodSolverFactory().create(
          this.state.player, this.state.enemy);
      this.solve_(solver);
    }
  }

  solve_(solver) {
    for (let i = 0; i < 10000 && !solver.done; i++) {
      solver.next();
    }
    if (solver.done) {
      this.setResult_(solver.rootNode.result);
    } else {
      const iterations = solver.runUntil.iteration - solver.iteration;
      this.setState(_.defaults({result: iterations}, this.state));
      setTimeout(this.solve_.bind(this, solver), 30);
    }
  }

  setResult_(result) {
    if (result) {
      new ResultAccessor().save(this.state.player, this.state.enemy, result);
      this.props.resultUpdated();
    }
    this.setState({result: result ? _.decimals(result, 4) : ''});
  }
}
