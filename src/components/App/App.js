import React, { PropTypes, Component } from 'react';
import style from './App.scss';
import Simulator from '../Simulator';
import Header from '../Header';
import Footer from '../Footer';
import _ from '../../utils/common';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Simulator onSimulationStart={this.onSimulationStart.bind(this)}
                   onSimulationFinish={this.onSimulationFinish.bind(this)} />
        <Footer />
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
