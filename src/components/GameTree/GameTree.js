import './GameTree.scss';
import NodePrinter from '../../ai/node-printer';
import _ from '../../utils/common';
import d3 from 'd3';
import $ from 'jquery';

export default class App {
  constructor(root) {
    this.root = root;
    root.classList.add('GameTree');
  }

  set rootNode(node) {
    this.rootNode_ = node;
  }

  render() {
    _.assert(this.rootNode_);
    const data = this.getTreeData_(this.rootNode_);
    this.createTree_(data);
  }

  getTreeData_(rootNode) {
    function grow(node) {
      return {
        name: NodePrinter.simple(node),
        children: (node.children || []).map(grow),
      };
    }
    return grow(rootNode);
  }

  createTree_(root) {
    const dy = 60;
    let i = 0;
    const duration = 250;
    const rectW = 60;
    const rectH = 20;

    const tree = d3.layout.tree().nodeSize([70, 40]);
    const diagonal = d3.svg.diagonal()
        .projection(d => [d.x + rectW / 2, d.y + rectH / 2]);

    const svg = d3.select('.GameTree').append('svg');
    const container = svg.append('g');

    function collapseAfterDepth(node, depth) {
      if (!node.children) return;
      node.children.forEach(c => collapseAfterDepth(c, depth - 1));
      if (depth <= 0) {
        node._children = node.children;
        node.children = null;
      }
    }

    collapseAfterDepth(root, 2);

    root.x0 = 0;
    root.y0 = 0;
    update(root);

    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(root).reverse();
      const links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(d => {
        d.y = d.depth * dy;
      });

      // Update the nodes…
      const node = container.selectAll('g.node')
            .data(nodes, d => {
              return d.id || (d.id = ++i);
            });

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => {
              return 'translate(' + source.x0 + ',' + source.y0 + ')';
            })
            .on('click', click)
            .on('contextmenu', rightclick);

      nodeEnter.append('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('fill', d => {
          return d._children && d._children.length ? 'lightsteelblue' : '#fff';
        });

      nodeEnter.append('text')
        .attr('x', rectW / 2)
        .attr('y', rectH / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(d => {
          return d.name;
        });

      // Transition nodes to their new position.
      const nodeUpdate = node.transition()
            .duration(duration)
            .attr('transform', d => {
              return 'translate(' + d.x + ',' + d.y + ')';
            });

      nodeUpdate.select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('fill', d => {
          return d._children && d._children.length ? 'lightsteelblue' : '#fff';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', d => {
              return 'translate(' + source.x + ',' + source.y + ')';
            })
            .remove();

      nodeExit.select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      nodeExit.select('text');

      // Update the links…
      const link = container.selectAll('path.link')
            .data(links, d => {
              return d.target.id;
            });

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('x', rectW / 2)
        .attr('y', rectH / 2)
        .attr('d', d => {
          const o = {
            x: source.x0,
            y: source.y0,
          };
          return diagonal({
            source: o,
            target: o,
          });
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr('d', d => {
          const o = {
            x: source.x,
            y: source.y,
          };
          return diagonal({
            source: o,
            target: o,
          });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      redrawAfterDelay();
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    function rightclick(d) {
      d3.event.preventDefault();
      function toggleAll(d, collapse) {
        let children;
        if (d.children && collapse) {
          d._children = d.children;
          d.children = null;
          children = d._children;
        } else if (!d.children && !collapse) {
          d.children = d._children;
          d._children = null;
          children = d.children;
        }
        if (children) children.forEach((c) => toggleAll(c, collapse));
      }
      toggleAll(d, !!d.children);
      update(d);
    }

    function redrawAfterDelay() {
      setTimeout(() => {
        const bbox = container[0][0].getBBox();
        svg.attr('width', () => bbox.width + 10)
           .attr('height', () => bbox.height + 2);
        container.attr('transform',
                       'translate(' + (-bbox.x + 1) + ',' + 1 + ')');
      }, duration);
    }
  }
}
