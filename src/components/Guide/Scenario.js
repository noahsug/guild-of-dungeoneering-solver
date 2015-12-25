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

  render() {
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
            <Tokenizer options={['Straightjacket', 'Ruffled Shirt']}
                       onTokenAdd={this.addItem_.bind(this, 'player')}
                       onTokenRemove={this.removeItem_.bind(this, 'player')}
            />
          </div>
          <div>
            <label>Player Traits</label>
            <Tokenizer options={['+1HP', '+2HP', '+3HP', '+4HP']}
                       onTokenAdd={this.addTrait_.bind(this, 'player')}
                       onTokenRemove={this.removeTrait_.bind(this, 'player')}
            />
          </div>
        </div>

        <div className="player">
          <div>
            <label>Enemy Name</label>
            <Typeahead options={['Fire Imp', 'Giant Bat', 'Goblin']}
                       value={this.state.enemy.name}
                       onOptionSelected={this.setName_.bind(this, 'enemy')}
            />
          </div>
          <div>
            <label>Enemy Traits</label>
            <Tokenizer options={[]}
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
    const newState = _.clone(this.state);
    newState[player] = _.defaults({
      name: name,
    }, newState[player]);
    this.setState(newState);
  }

  addItem_(player, item) {
    console.log('add item', item);
  }

  removeItem_(player, item) {
    console.log('remove item', item);
  }

  addTrait_(player, trait) {
    console.log('add trait', trait);
  }

  removeTrait_(player, trait) {
    console.log('remove trait', trait);
  }

  getResult_() {
    const solver = new GodSolverFactory().create(
        this.state.player, this.state.enemy);
    this.solve_(solver);
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
      this.setState(_.defaults({
        result: _.decimals(result, 4),
      }, this.state));
      this.props.resultUpdated();
    }
  }
}
