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
    return 'P: ' + rootNode.gameState.state.playerDeck +
      ' / ' + rootNode.gameState.state.playerHealth +
      '   E: ' + rootNode.gameState.state.enemyDeck +
      ' / ' + rootNode.gameState.state.enemyHealth;
  }

  getStats_(rootNode) {
    let nodes = 0;
    let solved = 0;

    function calcWinRate(node) {
      nodes++;
      if (node.result || (node.parent && node.parent.solved)) {
        node.solved = true;
        solved++;
      }

      let result;
      if (!node.children || !node.children.length) {
        if (node.wins == 0) result = 0;
        else if (node.wins == Infinity) result = 1;
        else result = node.wins / (node.wins + node.losses);
      } else if (node.children[0].type == 'chance') {
        let count = 0;
        let total = 0;
        node.children.forEach(child => {
          const weight = child.weight || 1;
          total += calcWinRate(child) * weight;
          count += child.weight;
        });
        result = total / count;
      } else {
        result = _.max(_.map(node.children, calcWinRate));
      }
      //node.winRate = result;
      return result;
    }

    const result = calcWinRate(rootNode);
    return {winRate: _.decimals(result * 100, 1),
            solved: _.decimals(100 * solved / nodes, 1),
            nodes};
  }

  getGameTree_(rootNode, diameter) {
    const data = this.generateTree_(rootNode);
    const tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2));

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
    const nodesAtDepth = [];
    function grow(node, depth = 1) {
      const limit = Math.max(250, depth * depth * 10);
      if (!nodesAtDepth[depth]) nodesAtDepth[depth] = 0;
      const children = [];
      (node.children || []).forEach(c => {
        if (nodesAtDepth[depth] < limit) {
          nodesAtDepth[depth]++;
          children.push(grow(c, depth + 1));
        }
      });
      return {name: NodePrinter.simple(node), children};
    }
    return [grow(rootNode)];
  }

  render() {
    const playerDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    const enemyDeck = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
    //const playerDeck = [1, 1, 1, 2];
    //const enemyDeck = [1, 1, 2, 3];
    const start = Date.now();
    const iterations = 10000;
    const rootNode = MctsRunner.run(playerDeck, enemyDeck,
                                    {iteration: iterations});
    const time = Date.now() - start;
    const diameter = 5400;
    const stats = this.getStats_(rootNode);
    const gameTree = this.getGameTree_(rootNode, diameter);
    const best = _.decimals(rootNode.bestResult * 100, 1);
    const worst = _.decimals(rootNode.worstResult * 100, 1);
    const expected = _.decimals(rootNode.expectedResult * 100, 1);

    return (
      <div>
        <h1>{this.printMatchup_(rootNode)}</h1>
        <h3>
          Win rate: {stats.winRate}% -
          Best: {best}% -
          Worst: {worst}% -
          Expected: {expected}% -
          Solved: {stats.solved}% -
          Nodes: {stats.nodes}
        </h3>
        Time: {time}ms - Iterations: {iterations - MctsRunner.mcts.iteration}
        {gameTree}
      </div>
    );
  }
}
