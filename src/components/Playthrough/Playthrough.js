import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import style from './Playthrough.scss';
import GodSolverFactory from '../../ai/god-solver-factory';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox';
import { Card, CardText, CardActions, CardTitle } from 'react-toolbox/lib/card';
import {Button, IconButton} from 'react-toolbox/lib/button';
import GameStateAccessor from '../../ai/game-state-accessor';
import GameCard from '../../ai/card';
import Node from '../../ai/node';
import gameData from '../../ai/game-data';
import _ from '../../utils/common';

export default class Playthrough extends Component {
  constructor(props) {
    super(props);
    this.accessor_ = new GameStateAccessor();
    let node = props.simulation.solver.rootNode;
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
    this.accessor_.setState(this.state.node.children[0].gameState.state);
    const {player, enemy} = this.accessor_;

    const title = this.props.simulation.player.name +
        ' vs ' +
        this.props.simulation.enemy.name;

    const subtitle = this.props.simulation.player.name + ': ' +
        player.health + 'hp, ' +
        this.props.simulation.enemy.name + ': ' +
        enemy.health + 'hp';

    return (
      <Card className={style.content} raised>
        <CardTitle title={title} subtitle={subtitle} />
        {this.accessor_.result ? '' : (
          <List selectable ripple>
            <ListSubHeader caption={this.getMoveType_()} />
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

  playthroughIsOver_() {
    return !this.state.node.children;
  }

  getMoveType_() {
    if (this.state.node.type == Node.Type.CHANCE) {
      return 'Play a card, enemy is playing ' +
          this.getReadableCards_(this.accessor_.enemy.hand);
    }
    if (!this.state.selectedPlayerHand) {
      return 'Select your hand';
    }
    return 'Select enemy\'s card';
  }

  renderMoves_() {
    const moves = {};
    this.state.node.children.forEach((child) => {
      // Select player card.
      if (this.state.node.type == Node.Type.CHANCE) {
        const card = this.getReadableCards_([child.gameState.move]);
        const onClick = this.selectNode_.bind(this, child);
        if (moves[card]) return;
        const pruned = _.isUndefined(child.winRate) ? 'pruned' : undefined;
        moves[card] = this.getSortableMoveItem_(child, card, onClick, pruned);
      }

      // Select player starting hand.
      else if (!this.state.selectedPlayerHand) {
        const {player} = this.accessor_.setState(child.gameState.state);
        player.hand.sort();
        const hand = this.getReadableCards_(player.hand);
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
        const {player, enemy} = this.accessor_.setState(child.gameState.state);
        player.hand.sort();
        const hand = this.getReadableCards_(player.hand);
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
    if (child.result == -Infinity) {
      // Child was pruned, so we have to calculate win rate manually.
      let total = 0;
      let count = 0;
      child.children.forEach(node => {
        if (!isFinite(node.result)) return;
        count++;
        total += node.result < 0 ? 0 : node.result;
      });
      child.result = count && total / count;
    }

    let winRate = child.result < 0 ? 0 : child.result;
    if (isFinite(opt_winRate)) winRate = opt_winRate;
    let legend = _.percent(winRate) + '% win rate';
    let listItemClass = '';

    if (opt_winRate == 'pruned') {
      legend = 'pruned';
      listItemClass = style.pruned;
      onClick = _.emptyFn;
      winRate = -1;
    }

    const element = (
      <ListItem caption={cards}
                key={cards}
                className={listItemClass}
                legend={legend}
                onClick={onClick} />
    );
    return {element, winRate};
  }

  getReadableCards_(hand) {
    return hand.map(card => GameCard.list[card].desc).join(', ');
  }

  selectPlayerHand_(hand) {
    this.setState({selectedPlayerHand: hand});
  }

  selectNode_(node) {
    let selectedPlayerHand = this.state.selectedPlayerHand;
    if (node.type == Node.Type.CHANCE) {
      node = this.props.simulation.solver.setState(node.gameState.state)
          .solve();
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
