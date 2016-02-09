import React, { PropTypes, Component } from 'react';
import './Playthrough.scss';
import {Typeahead, Tokenizer} from 'react-typeahead';
import GodSolverFactory from '../../ai/god-solver-factory';
import Card from '../../ai/card';
import Node from '../../ai/node';
import gameData from '../../ai/game-data';
import _ from '../../utils/common';

export default class Playthrough extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onSimulationStart: React.PropTypes.func.required,
    onSimulationFinish: React.PropTypes.func.required,
  }

  render() {
    return (
      <div className="Playthrough">
      </div>
    );
  }
}
