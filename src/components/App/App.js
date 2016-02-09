import React, { PropTypes, Component } from 'react';
import './App.scss';
import Simulator from '../Simulator';
import Header from '../Header';
import _ from '../../utils/common';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Simulator onSimulationStart={this.onSimulationStart.bind(this)}
                   onSimulationFinish={this.onSimulationFinish.bind(this)} />
      </div>
    );
  }

  onSimulationStart({input, rootNode}) {
    console.log('sim start', input, rootNode);
  }

  onSimulationFinish(rootNode) {
    console.log('new finish!');
  }
}
