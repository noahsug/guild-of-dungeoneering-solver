import React, { PropTypes, Component } from 'react';
import style from './Results.scss';
import _ from '../../utils/common';

export default class Results extends Component {
  static propTypes = {
    results: React.PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className={style.content}>
        {this.props.results.map(this.renderResult_.bind(this))}
      </div>
    );
  }

  renderResult_(result, i) {
    let playerItems = result.player.items.join(', ');
    let playerTraits = result.player.traits.join(', ');
    const enemyTraits = result.enemy.traits.join(', ');
    const winRate = result.solver.rootNode.result;
    const percent = 100 * (winRate == -1 ? 0 : winRate);
    if (playerItems) playerItems = ' ' + playerItems;
    if (playerTraits) playerTraits = ' ' + playerTraits;
    return (
      <p key={i}>
        {result.player.name + playerItems + playerTraits} vs {
        result.enemy.name + enemyTraits}: <strong>
          {_.decimals(percent, 2)}%
        </strong>
      </p>
    );
  }
}
