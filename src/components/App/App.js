import React, { PropTypes, Component } from 'react';
import style from './App.scss';
import Simulator from '../Simulator';
import Results from '../Results';
import Playthrough from '../Playthrough';
import CardNames from '../CardNames';
import Header from '../Header';
import Footer from '../Footer';
import _ from '../../utils/common';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {results: [], showPlaythrough: false};
  }

  render() {
    return (
      <div>
        <Header />
        <Simulator onSimulationStart={this.onSimulationStart_.bind(this)}
                   onSimulationFinish={this.onSimulationFinish_.bind(this)}
                   openPlaythrough={this.openPlaythrough_.bind(this)} />
        {this.state.showPlaythrough ? (
            <span>
              <Playthrough simulation={this.simulation_}
                           close={this.closePlaythrough_.bind(this)} />
              <CardNames simulation={this.simulation_} />
            </span>
        ) : ''}
        <Results results={this.state.results} />
        <Footer />
      </div>
    );
  }

  onSimulationStart_(simulation) {
    this.simulation_ = simulation;
  }

  onSimulationFinish_() {
    const results = this.state.results.concat([this.simulation_]);
    this.setState({results});
  }

  openPlaythrough_() {
    // Trigger playthrough to be re-rendered.
    this.setState({showPlaythrough: false});
    setTimeout(() => this.setState({showPlaythrough: true}), 1);
  }

  closePlaythrough_() {
    this.setState({showPlaythrough: false});
  }
}
