import './GameplayView.scss';
import NodePrinter from '../../ai/node-printer';
import Card from '../../ai/card';
import Node from '../../ai/node';
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

  render() {
    _.assert(this.rootNode_);
    this.node_ = this.rootNode_;
    this.renderChanceStates_();
  }

  renderChanceStates_() {
    this.root.innerHTML = '';
    const {player, enemy} =
        new GameStateAccessor().setState(this.node_.gameState.state);

    this.root.appendChild(this.renderPlayer_(player, 'player'));
    this.root.appendChild(this.renderPlayer_(enemy, 'enemy'));
    this.root.appendChild(this.renderChanceOptions_());

    this.root.appendChild(this.renderResetBtn_());
  }

  renderState_() {
    this.root.innerHTML = '';
    const {player, enemy} =
        new GameStateAccessor().setState(this.node_.gameState.state);

    this.root.appendChild(this.renderPlayer_(player, 'player'));
    this.root.appendChild(this.renderPlayer_(enemy, 'enemy'));
    this.root.appendChild(this.renderResetBtn_());
  }

  renderPlayer_(player, name) {
    const container = document.createElement('div');
    container.classList.add('info-block');

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
    container.appendChild(this.renderRow_('hand',
                                          this.renderHand_(player, name)));
    container.appendChild(
        this.renderRow_('discard', player.discardPile.length));
    return container;
  }

  renderChanceOptions_() {
    const container = document.createElement('div');
    container.classList.add('info-block', 'random-states');
    const visited = {};
    const children = _.sortBy(this.node_.children, (c) => {
      if (c.result) return 10000 + c.result;
      return c.winRate;
    });
    children.forEach((c) => {
      if (c.__id != undefined) {
        if (visited[c.__id]) return;
        visited[c.__id] = true;
      }
      const {player, enemy} =
          new GameStateAccessor().setState(c.gameState.state);
      const option = document.createElement('div');
      option.classList.add('option', 'clickable');

      option.appendChild(this.renderHand_(player));
      option.appendChild(this.renderHand_(enemy));

      const results = document.createElement('span');
      option.appendChild(results);
      if (c.result) {
        results.innerText += ` (${c.result}!)`;
      } else if (c.winRate) {
        results.innerText += ` (${c.winRate})`;
      }

      container.appendChild(option);
      option.onclick = () => this.onClick_(c);
    });
    return container;
  }

  renderHand_(player, type) {
    const container = document.createElement('span');
    container.classList.add('hand');
    player.hand.forEach((c, i) => {
      const card = document.createElement('span');
      card.classList.add('option');
      card.innerText = Card.list[c].desc;
      const node = this.getNode_(c);
      if (type == 'player' && node) {
        if (node.result) {
          card.innerText += ` (${node.result}!)`;
        } else if (node.winRate) {
          card.innerText += ` (${node.winRate})`;
        }
        card.onclick = () => this.onClick_(node);
        card.classList.add('clickable');
      }
      if (type == 'player') {
        if (this.node_.gameState.move == c) {
          card.classList.add('selected');
        }
      }
      container.appendChild(card);
    });
    return container;
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

  renderResetBtn_() {
    const reset = document.createElement('button');
    reset.innerText = 'reset';
    reset.onclick = () => this.render();
    return reset;
  }

  onClick_(c) {
    this.node_ = c;
    if (this.node_.cached) this.node_ = this.node_.cached;
    if (c.type == Node.Type.PLAYER) {
      this.renderChanceStates_();
    } else {
      this.renderState_();
    }
  }

  nextNode_(move) {
    if (this.node_.children && this.node_.children.length) {
      this.node_ = _.min(this.node_.children, (c) => {
        const result = c.result || c.winRate || 0;
        return result + Math.random() / 1000;
      });
    }
    if (this.node_.cached) this.node_ = this.node_.cached;
  }
}
