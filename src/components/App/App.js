import React, { PropTypes, Component } from 'react';
import './App.scss';
import Simulator from '../Simulator';
import _ from '../../utils/common';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Simulator simulationComplete={this.onSimulationComplete.bind(this)} />
      </div>
    );
  }

  onSimulationComplete(rootNode) {
    console.log('new results!', rootNode);
  }
}
