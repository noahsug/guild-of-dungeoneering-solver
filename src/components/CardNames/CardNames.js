import React, { PropTypes, Component } from 'react';
import style from './CardNames.scss';
import GameStateAccessor from '../../lib/game-engine/game-state-accessor';
import GameCard from '../../lib/game-engine/card';
import gameData from '../../lib/game-engine/game-data';
import _ from '../../utils/common';

export default class CardNames extends Component {
  static propTypes = {
    simulation: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className={style.content}>
        <p className={style.title}>Card Reference</p>
        {this.renderCardNames_(this.props.simulation.solver.rootNode)}
      </div>
    );
  }

  renderCardNames_(rootNode) {
    while (rootNode.parent) rootNode = rootNode.parent;
    const {player, enemy} = GameStateAccessor.instance.setState(
        rootNode.gameState.state);

    return _.chain(player.deck.concat(enemy.deck))
      .map(cardIndex => GameCard.list[cardIndex].desc)
      .expand(desc => desc.split(GameCard.DELIMITER))
      .unique()
      .tap(attrs => attrs.sort())
      .map(attr => (
        <p key={attr}>
          <strong>{attr}</strong>: {this.getAttrDescription_(attr)}
        </p>
      ))
      .value();
  }

  getAttrDescription_(attr) {
    return _.s.humanize(gameData.CARD_ATTRS[attr]);
  }
}
