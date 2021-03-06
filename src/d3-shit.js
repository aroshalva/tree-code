/* eslint-disable */
import fileIconsJs, { getClassWithColor } from 'file-icons-js'
import { attachId } from "./constants"
import path from "path"
import 'file-icons-js/css/style.css'


// const folderColors = [
//     "#FFB1B0",
//     "#FFDFBE",
//     "#B4F0A7",
//     "#A9D1F7",
//     "#CC99FF",
// ]

const folderColors = [
    "none",
    // "#CB4335",
    // "#A569BD",
    // "#2874A6",
    // "#D68910",
    // "#52BE80",
]

export const attachTree = ({ treeData, onNodeClick, viewerWidth, viewerHeight }) => {

  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 250;
  var root;

  var tree = d3.layout.tree()
      .size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
//   var diagonal = d3.svg.diagonal()
//       .projection(function(d) {
//           return [d.y, d.x];
//       });
var rectNode = { width : 250, height : 45 }

var nodeRoundCorners = 5

function diagonal(d) {
  var p0 = {
    x : d.source.x + rectNode.height / 2,
    y : (d.source.y + rectNode.width)
  }, p3 = {
    x : d.target.x + rectNode.height / 2,
    y : d.target.y
  }, m = (p0.y + p3.y) / 2, p = [ p0, {
    x : p0.x,
    y : m
  }, {
    x : p3.x,
    y : m
  }, p3 ];
  p = p.map(function(d) {
      return [ d.y, d.x ];
  });
  return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
  }

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
      if (!parent) return;

      visitFn(parent);

      var children = childrenFn(parent);
      if (children) {
          var count = children.length;
          for (var i = 0; i < count; i++) {
              visit(children[i], visitFn, childrenFn);
          }
      }
  }

  // Call visit function to establish maxLabelLength
  visit(treeData, function(d) {
      totalNodes++;
      maxLabelLength = Math.max(d.name.length, maxLabelLength);

  }, function(d) {
      return d.children && d.children.length > 0 ? d.children : null;
  });


  // sort the tree according to the node names

  function sortTree() {
      tree.sort(function(a, b) {
          return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
      });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  // sortTree();

  // Define the zoom function for the zoomable tree

  function zoom() {
      svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }


  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.01, 3]).on("zoom", zoom);

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3.select(`#${attachId}`).append("svg")
      .attr("width", viewerWidth)
      .attr("height", viewerHeight)
      .attr("class", "overlay")
      .call(zoomListener);

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  function centerNode(source) {
      var scale = zoomListener.scale();
      var x = -source.y0;
      var y = -source.x0;
      x = x * scale + viewerWidth / 2;
      y = y * scale + viewerHeight / 2;
      d3.select('g').transition()
          .duration(duration)
          .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
      zoomListener.scale(scale);
      zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
      } else if (d._children) {
          d.children = d._children;
          d._children = null;
      }
      return d;
  }

  // Toggle children on click.

  function click(d) {
      if (d3.event.defaultPrevented) return; // click suppressed
      d = toggleChildren(d);
      update(d);

      if (d.children || d._children) {
          centerNode(d);
      }

      onNodeClick(d)
  }

  function update(source) {
      // Compute the new height, function counts total children of root node and sets tree height accordingly.
      // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
      // This makes the layout more consistent.
      var levelWidth = [1];
      var childCount = function(level, n) {

          if (n.children && n.children.length > 0) {
              if (levelWidth.length <= level + 1) levelWidth.push(0);

              levelWidth[level + 1] += n.children.length;
              n.children.forEach(function(d) {
                  childCount(level + 1, d);
              });
          }
      };
      childCount(0, root);
      var newHeight = d3.max(levelWidth) * 120; // 25 pixels per line
      tree = tree.size([newHeight, viewerWidth]);

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Set widths between levels based on maxLabelLength.
      nodes.forEach(function(d) {
        //   d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
          // alternatively to keep a fixed scale one can set a fixed depth per level
          // Normalize for fixed-depth by commenting out below line
          d.y = (d.depth * 500); //500px per level.
      });

      // Update the nodes…
      var node = svgGroup.selectAll("g.node")
          .data(nodes, function(d) {
              return d.id || (d.id = ++i);
          });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          // .call(dragListener)
          .attr("class", "node")
          .attr("transform", function(d) {
              return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .on('click', click);

      // nodeEnter.append("circle")
      nodeEnter.append("rect")
          .attr('class', 'nodeCircle')
          // .attr("r", 0)
          .attr("width", 0)
          .attr("height", 0)
          .attr("rx", nodeRoundCorners)								// how much to round corners - to be transitioned below
		  .attr("ry", nodeRoundCorners)
          .style("fill", function(d) {
              return d._children ? "black" : "white";
          })
        //   .style("stroke", "lightgrey")
        //   .style("stroke-width", 5);

      nodeEnter.append("foreignObject")
        .attr('class', (d) => {
            let classValue = "fileIcon"

            if (!d.children && !d._children) {
                classValue += " " + getClassWithColor.bind(fileIconsJs)(d.name)
            }

            return classValue
        })
        .attr("width", 0)
        .attr("height", 0)

      const textX = d => d.children || d._children ? 10 : rectNode.height + 5;
      const textY = 17;

      nodeEnter.append("text")
          .attr("x", textX)
          .attr("y", textY)
          .attr("dy", ".35em")
          .attr('class', 'nodeText')
          .attr("text-anchor", function(d) {
              return "start";
          })
          .text(function(d) {
              return d.name;
          })
          .style("fill-opacity", 0)
          .style("font-size", 40)
          .style("font-weight", "bold")
          .style("fill", function(d) {
            return d.children || d._children ? "white" : "white";
        });

      // // phantom node to give us mouseover in a radius around it
      // nodeEnter.append("circle")
      //     .attr('class', 'ghostCircle')
      //     .attr("r", 30)
      //     .attr("opacity", 0.2) // change this to zero to hide the target area
      // .style("fill", "red")
      //     .attr('pointer-events', 'mouseover')
      //     .on("mouseover", function(node) {
      //         overCircle(node);
      //     })
      //     .on("mouseout", function(node) {
      //         outCircle(node);
      //     });

      // Update the text to reflect whether node has children or not.
      node.select('text')
          .attr("x", textX)
          .attr("y", textY)
          .attr("text-anchor", function(d) {
              return "start";
          })
          .text(function(d) {
              return d.name;
          });

      // Change the circle fill depending on whether it has children and is collapsed
      // node.select("circle.nodeCircle")
      //     .attr("r", 4.5)
      //     .style("fill", function(d) {
      //         return d._children ? "lightsteelblue" : "#fff";
      //     });

      node.select("rect.nodeCircle")
          .attr("width", rectNode.width)
          .attr("height", rectNode.height)
          .style("fill", function(d) {
            if (d._children) {
                return "black"
            }

            // if (!d.children) {
            //     return "white"
            // }

            return d._children ? "black" : folderColors[d.depth % folderColors.length];
          });

      node.select("foreignObject.fileIcon")
        .attr("width", rectNode.height)
        .attr("height", rectNode.height)

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + d.y + "," + d.x + ")";
          });

      // Fade the text in
      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

      // nodeExit.select("circle")
      //     .attr("r", 0);
      nodeExit.select("rect")
          .attr("width", 0)
          .attr("height", 0);

      nodeExit.select("text")
          .style("fill-opacity", 0);

      // Update the links…
      var link = svgGroup.selectAll("path.link")
          .data(links, function(d) {
              return d.target.id;
          });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
              var o = {
                  x: source.x0,
                  y: source.y0
              };

              return diagonal({
                  source: o,
                  target: o
              });
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
              var o = {
                  x: source.x,
                  y: source.y
              };
              return diagonal({
                  source: o,
                  target: o
              });
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
      });
  }

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  const duduna = (allData) => {
    const bubuna = (listData) => listData.forEach(currentElem => duduna(currentElem))

    if (allData.children) {
      bubuna(allData.children)

      toggleChildren(allData)
    }
  }


  // Layout the tree initially and center on the root node.
  update(root);

  // to collapse all from start
//   duduna(treeData)
//   update(root);

centerNode(root);
}