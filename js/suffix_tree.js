/*import { DataSet } from "./node_modules/vis-data";
import { Network } from "./node_modules/vis-network/peer/esm/vis-network";
import "./node_modules/vis-network/styles/vis-network.css";
*/

function Build_Tree() {
// create an array with nodes
const nodes = new vis.DataSet([
{ id: 1, label: "Node 1" },
{ id: 2, label: "Node 2" },
{ id: 3, label: "Node 3" },
{ id: 4, label: "Node 4" },
{ id: 5, label: "Node 5" }
]);

// create an array with edges
const edges = new vis.DataSet([
{ from: 1, to: 3 },
{ from: 1, to: 2 },
{ from: 2, to: 4 },
{ from: 2, to: 5 },
{ from: 3, to: 3 }
]);

console.log(edges);
console.log(nodes);

// create a network
const container = document.getElementById("mynetwork");
const data = {
nodes: nodes,
edges: edges
};

const options = {};
const network = new vis.Network(container, data, options);
}

Build_Tree();
