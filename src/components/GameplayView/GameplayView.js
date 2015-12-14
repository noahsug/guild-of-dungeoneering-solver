import './GameplayView.scss';
import NodePrinter from '../../ai/node-printer';
import Card from '../../ai/card';
import GameStateAccessor from '../../ai/game-state-accessor';
import _ from '../../utils/common';
import d3 from 'd3';
import $ from 'jquery';

export default class App {
  constructor(root) {
    this.root = root;
    root.classList.add('GameplayView');
  }

  set rootNode(node) {
    this.rootNode_ = node;
  }

  nextNode_(move) {
    if (this.node_.children && this.node_.children.length) {
      this.node_ = _.min(this.node_.children, (c) => c.expectedResult || 0);
    }
  }

  render() {
    _.assert(this.rootNode_);
    this.node_ = this.rootNode_;
    this.nextNode_();
    this.renderState_();
  }

  renderState_() {
    this.root.innerHTML = '';
    const {player, enemy} =
        new GameStateAccessor().setState(this.node_.gameState.state);

    this.root.appendChild(this.renderPlayer_(player, 'player'));
    this.root.appendChild(this.renderPlayer_(enemy, 'enemy'));

    const reset = document.createElement('button');
    reset.innerText = 'reset';
    reset.onclick = () => this.render();
    this.root.appendChild(reset);
  }

  renderPlayer_(player, name) {
    const container = document.createElement('div');
    container.classList.add(name);

    const title = document.createElement('div');
    title.classList.add('player-title');
    title.innerText = name;
    container.appendChild(title);

    let healthText = player.health;
    if (this.node_.parent && this.node_.parent.parent) {
      const [playerParent, enemyParent] =
          GameStateAccessor.access(this.node_.parent.parent.gameState.state);
      const parent = name == 'player' ? playerParent : enemyParent;
      const lostHealth = player.health - parent.health;
      healthText += ' (' + lostHealth + ')';
    }

    container.appendChild(this.renderRow_('health', healthText));
    container.appendChild(this.renderRow_('deck', player.deck.length));
    container.appendChild(this.renderHand_(player, name));
    container.appendChild(
        this.renderRow_('discard', player.discardPile.length));
    return container;
  }

  onClick_(c) {
    this.node_ = c;
    this.nextNode_();
    this.renderState_();
  }

  renderHand_(player, type) {
    const container = document.createElement('span');
    player.hand.forEach((c) => {
      const card = document.createElement('span');
      card.classList.add('card');
      card.innerText = Card.list[c].desc;
      const node = this.getNode_(c);
      if (type == 'player' && node) {
        if (node.result) {
          card.innerText += ` (${node.result}!)`;
        } else if (node.expectedResult) {
          card.innerText += ` (${node.expectedResult})`;
        }
        card.onclick = () => this.onClick_(node);
        card.classList.add('clickable');
      }
      container.appendChild(card);
    });
    return this.renderRow_('hand', container);
  }

  getNode_(move) {
    return _.find(this.node_.children, (c) => c.gameState.move == move);
  }

  renderRow_(label, content) {
    const container = document.createElement('div');
    const labelEle = document.createElement('label');
    labelEle.innerText = label + ': ';
    container.appendChild(labelEle);

    if (!_.isObject(content)) {
      const contentEle = document.createElement('span');
      contentEle.innerText = content;
      content = contentEle;
    }
    container.appendChild(content);
    return container;
  }
}
