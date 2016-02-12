import React, { PropTypes, Component } from 'react';
import style from './App.scss';
import Simulator from '../Simulator';
import Results from '../Results';
import Header from '../Header';
import Footer from '../Footer';
import _ from '../../utils/common';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
  }

  render() {
    return (
      <div>
        <Header />
        <Simulator onSimulationStart={this.onSimulationStart.bind(this)}
                   onSimulationFinish={this.onSimulationFinish.bind(this)} />
        <Results results={this.state.results} />
        <Footer />
      </div>
    );
  }

  onSimulationStart(simulation) {
    this.simulation_ = simulation;
  }

  onSimulationFinish() {
    const results = this.state.results.concat([this.simulation_]);
    this.setState({results});
  }
}
