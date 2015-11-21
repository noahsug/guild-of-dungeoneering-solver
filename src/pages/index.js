/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component } from 'react';
import d3 from 'd3';
import MctsRunner from '../ai/mcts-runner';
import NodePrinter from '../ai/node-printer';
import _ from '../utils/common';

export default class extends Component {
  printMatchup_(rootNode) {
    return 'P: ' + rootNode.gameState.playerDeck +
      ' / ' + rootNode.gameState.playerHealth +
      '   E: ' + rootNode.gameState.enemyDeck +
      ' / ' + rootNode.gameState.enemyHealth;
  }

  getWinRate_(rootNode) {
    function calcWinRate(node) {
      let result;
      if (!node.children || !node.children.length) {
        if (node.wins == 0) result = 0;
        else if (node.wins == Infinity) result = 1;
        else result = node.wins / (node.wins + node.losses);
      } else if (node.children[0].type == 'chance') {
        result = _.avg(node.children, calcWinRate);
      } else {
        result = _.max(_.map(node.children, calcWinRate));
      }
      //node.winRate = result;
      return result;
    }

    let result = calcWinRate(rootNode);
    result = _.decimals(result * 100, 0);
    return result;
  }

  getGameTree_(rootNode, diameter) {
    const data = this.generateTree_(rootNode);
    const tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    const diagonal = d3.svg.diagonal.radial()
        .projection((d) => [d.y, d.x / 180 * Math.PI]);

    const root = data[0];
    const nodes = tree.nodes(root);

    const links = tree.links(nodes).map((link, idx) => {
      return (
          <path className="link" key={idx} d={diagonal(link)}></path>
      );
    });

    const nodeElements = nodes.map((node, idx) => {
      const t = `rotate(${node.x - 90})translate(${node.y})`;
      const textTransform = node.x < 180 ?
          'translate(8)' : 'rotate(180)translate(-8)';
      return (
        <g className="node" key={idx} transform={t}>
          <circle r="5"></circle>
          <text dy=".35em" textAnchor={node.x < 180 ? 'start' : 'end'}
              transform={textTransform}>
            {node.name}
          </text>
        </g>
      );
    });

    const t = `translate(${diameter / 2}, ${diameter / 2})`;
    return (
      <svg width={diameter} height={diameter}>
        <g transform={t}>
          {links}
          {nodeElements}
        </g>
      </svg>
    );
  }

  generateTree_(rootNode) {
    function grow(node) {
      return {
        name: NodePrinter.simple(node),
        children: (node.children || []).map(grow),
      };
    }
    return [grow(rootNode)];
  }

  render() {
    //const playerDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    //const enemyDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const playerDeck = [1, 2, 3, 4];
    const enemyDeck = [1, 2, 3, 4];
    const start = Date.now();
    const rootNode = MctsRunner.run(playerDeck, enemyDeck);
    const time = Date.now() - start;
    const diameter = 5400;
    const gameTree = this.getGameTree_(rootNode, diameter);

    return (
      <div>
        <h1>{this.printMatchup_(rootNode)}</h1>
        <h3>win rate: {this.getWinRate_(rootNode)}%</h3>
        Time: {time}ms
        {gameTree}
      </div>
    );
  }
}
