import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import style from './Playthrough.scss';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import { Card, CardText, CardActions, CardTitle } from 'react-toolbox/lib/card';
import {Button, IconButton} from 'react-toolbox/lib/button';
import gs from '../../lib/game-engine/game-state';
import GameCard from '../../lib//game-engine/card';
import Node from '../../lib/tree-search/node';
import gameData from '../../lib/game-engine/game-data';
import _ from '../../utils/common';

export default class Playthrough extends Component {
  constructor(props) {
    super(props);
    this.solver_ = this.props.simulation.solver;
    this.nodeFactory_ = this.solver_.nodeFactory;

    let node = this.solver_.rootNode;
    while (node.parent) node = node.parent;
    this.state = {
      node,
      selectedPlayerHand: '',
    };
  }

  static propTypes = {
    simulation: React.PropTypes.object.isRequired,
    close: React.PropTypes.func,
  }

  render() {
    // Create children, add ones optimized out as pruned.
    if (!this.state.node.children) {
      this.nodeFactory_.createChildren(this.state.node);
    }
    const gameState =
        gs.newTurnClone(this.state.node.children[0].state);

    const title = this.props.simulation.player.name +
        ' vs ' +
        this.props.simulation.enemy.name;

    const subtitle = this.props.simulation.player.name + ': ' +
        gameState.player.health + 'hp, ' +
        this.props.simulation.enemy.name + ': ' +
        gameState.enemy.health + 'hp';

    return (
      <Card className={style.content} raised>
        <CardTitle title={title} subtitle={subtitle} />
        {gs.result(gameState) ? '' : (
          <List selectable ripple>
            <ListSubHeader caption={this.getMoveType_(gameState)} />
            {this.renderMoves_()}
          </List>
        )}
        <CardActions>
          {this.state.node.parent ? (
            <Button label="Back" onClick={this.goBack_.bind(this)} />
          ) : ''}
          <Button label="Close" onClick={this.props.close} />
        </CardActions>
      </Card>
    );
  }

  playthroughIsOver_(state) {
    return !this.state.node.children;
  }

  getMoveType_(gameState) {
    if (this.state.node.type == Node.Type.CHANCE) {
      return 'Play a card, enemy is playing ' +
          this.getReadableCards_(gameState.enemy.hand);
    }
    if (!this.state.selectedPlayerHand) {
      return 'Select your hand';
    }
    return 'Select enemy\'s card';
  }

  renderMoves_() {
    const moves = {};
    this.state.node.children.forEach((child) => {
      const {player, enemy} = gs.newTurnClone(child.state);
      const hand = this.getReadableCards_(player.hand);

      // Select player card.
      if (this.state.node.type == Node.Type.CHANCE) {
        const card = this.getReadableCards_([child.move]);
        const onClick = this.selectNode_.bind(this, child);
        if (moves[card]) return;
        const pruned = child.result ? undefined : 'pruned';
        moves[card] = this.getSortableMoveItem_(child, card, onClick, pruned);
      }

      // Select hand.
      else if (!this.state.selectedPlayerHand) {
        const onClick = this.selectPlayerHand_.bind(this, hand);

        // Average the win rate between all cards.
        let winRate = child.result < 0 ? 0 : child.result;
        let count = 1;
        if (moves[hand]) {
          count = moves[hand].count;
          const winRateSum = moves[hand].winRate * count + winRate;
          count++;
          winRate = winRateSum / count;
        }
        moves[hand] = this.getSortableMoveItem_(child, hand, onClick, winRate);
        moves[hand].count = count;
      }

      // Select enemy card.
      else {
        if (hand != this.state.selectedPlayerHand) return;
        const card = this.getReadableCards_(enemy.hand);
        const onClick = this.selectNode_.bind(this, child);
        if (moves[card]) return;
        moves[card] = this.getSortableMoveItem_(child, card, onClick);
      }
    });

    return _.pluck(_.sortBy(moves, 'winRate'), 'element').reverse();
  }

  getSortableMoveItem_(child, cards, onClick, opt_winRate) {
    if (!child.result || child.result == -Infinity) {
      // Child was pruned, so we have to calculate win rate manually.
      let total = 0;
      let count = 0;
      (child.children || []).forEach(node => {
        if (!isFinite(node.result)) return;
        count++;
        total += node.result < 0 ? 0 : node.result;
      });
      child.result = count && total / count;
    }

    let winRate = _.minZero(child.result)
    if (isFinite(opt_winRate)) winRate = opt_winRate;
    let legend = _.percent(winRate) + '% win rate';

    if (opt_winRate == 'pruned') {
      legend = 'pruned';
      winRate = -1;
    }

    const element = (
      <ListItem caption={cards}
                key={cards}
                legend={legend}
                onClick={onClick} />
    );
    return {element, winRate};
  }

  getReadableCards_(hand) {
    return hand.map(card => GameCard.list[card].desc).sort().join(', ');
  }

  selectPlayerHand_(hand) {
    this.setState({selectedPlayerHand: hand});
  }

  selectNode_(node) {
    let selectedPlayerHand = this.state.selectedPlayerHand;
    if (node.type == Node.Type.CHANCE) {
      this.solver_.clearCache();
      node = this.solver_.setState(node.state).solve();
      selectedPlayerHand = '';
    }
    node.parent = this.state.node;
    this.setState({node: node, selectedPlayerHand});
  }

  goBack_() {
    this.setState({node: this.state.node.parent, selectedPlayerHand: ''});
  }

  componentDidMount() {
    // TODO: Smoothly scroll.
    const domNode = ReactDOM.findDOMNode(this);
    domNode.scrollIntoView();
  }
}
