import React, { PropTypes, Component } from 'react';
import './Guide.scss';
import Scenario from './Scenario';
import results from '../../ai/results';
import _ from '../../utils/common';

export default class Guide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Guide">
        <table>
          <tbody>
            <tr>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)}
                            playerName="Chump" enemyName="Giant Bat"
                            playerItem="Ruffled Shirt"
              /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
            </tr>
            <tr>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
            </tr>
            <tr>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
              <td><Scenario resultUpdated={this.forceUpdate.bind(this)} /></td>
            </tr>
          </tbody>
        </table>

        <textarea className="results" rows="15" readOnly
                  value={this.getResult_()}>
        </textarea>
      </div>
    );
  }

  getResult_() {
    return JSON.stringify(results, null, 2);
  }
}
