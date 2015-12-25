import React, { PropTypes, Component } from 'react';
import './Guide.scss';
import {Typeahead, Tokenizer} from 'react-typeahead';
import GodSolverFactory from '../../ai/god-solver-factory';
import Card from '../../ai/card';
import Node from '../../ai/node';
import ResultAccessor from '../../ai/result-accessor';
import results from '../../ai/results';
import gameData from '../../ai/game-data';
import _ from '../../utils/common';

export default class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {name: 'Chump'},
      enemies: [],
    };
  }

  render() {
    return (
      <div className="guide">
        <div className="player">
          <div>Name:
            <Typeahead options={['John', 'Paul', 'George', 'Ringo']}
                       onOptionSelected={this.setPlayerName_}
            />
          </div>
          <div>Items: {(this.state.player.items || []).join(', ')}</div>
          <div>Traits: {(this.state.player.traits || []).join(', ')}</div>
        </div>

        <div className="enemies">
          {this.renderEnemies_()}
        </div>
      </div>
    );
  }

  setPlayerName_(name) {
    console.log('selected!', name);
  }

  renderEnemies_() {
    return this.state.enemies.map((enemy, i) => {
      return (
        <div className="row" key={i}>
          <div className="player enemy">
            <div>Name: {enemy.name}</div>
            <div>Traits: {(enemy.traits || []).join(', ')}</div>
          </div>
          <div className="result">{enemy.result}</div>
        </div>
      );
    });
  }
}
