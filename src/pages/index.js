/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component } from 'react';
import d3 from 'd3';

export default class extends Component {
  render() {
    const diameter = 960;
    const data = [{
      name: 'Top Level',
      children: [
        {
          name: 'Level 2: A',
          children: [
            {
              name: 'Son of A',
            },
            {
              name: 'Daughter of A',
            },
          ],
        },
        {
          name: 'Level 2: B',
        },
      ],
    }];

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
          <circle r="4.5"></circle>
          <text dy=".31em" textAnchor={node.x < 180 ? 'start' : 'end'}
            transform={textTransform}>
            {node.name}
          </text>
        </g>
      );
    });

    const t = `translate(${diameter / 2}, ${diameter / 2})`;
    return (
      <div>
        <svg width={diameter} height={diameter - 150}>
          <g transform={t}>
            {links}
            {nodeElements}
          </g>
        </svg>
      </div>
    );
  }
}
