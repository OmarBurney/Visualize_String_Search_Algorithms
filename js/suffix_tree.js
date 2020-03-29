/*import { DataSet } from "./node_modules/vis-data";
import { Network } from "./node_modules/vis-network/peer/esm/vis-network";
import "./node_modules/vis-network/styles/vis-network.css";
*/

function Build_Tree() {
    // create an array with nodes
    let nodes = [
        { id:   0, label: "", shape: "dot", color: "#000000", size: 5 },
        { id:   1, label: "   1   "    },
        { id:   2, label: "   2   "    },
        { id:   3, label: "   3   "    },
        { id:   4, label: "   4   "    },
        { id:   5, label: "   5   "    },
        { id:   6, label: "   6   "    },
        { id:   7, label: "   7   "    },
        { id:  35, label: "", shape: "dot", color: "#000000", size: 2 },
        { id: 642, label: "", shape: "dot", color: "#000000", size: 2 },
        { id:  42, label: "", shape: "dot", color: "#000000", size: 2 }
    ];
    nodes[0]["level"]  = 0;
    nodes[7]["level"]  = 1;
    nodes[9]["level"]  = 1; // 642
    nodes[1]["level"]  = 1;
    nodes[8]["level"]  = 1;  // 35
    nodes[6]["level"]  = 2;
    nodes[10]["level"] = 2; // 42
    nodes[3]["level"]  = 2;
    nodes[5]["level"]  = 2;
    nodes[4]["level"]  = 3;
    nodes[2]["level"]  = 3;
    nodes = new vis.DataSet(nodes);

    // create an array with edges
    let edges = new vis.DataSet([
        { from:   0, to:   7, label: "$"       },
        { from:   0, to: 642, label: "a"       },
        { from:   0, to:   1, label: "banana$" },
        { from:   0, to:  35, label: "na"      },
        { from: 642, to:   6, label: "$"       },
        { from: 642, to:  42, label: "na"      },
        { from:  42, to:   4, label: "$"       },
        { from:  42, to:   2, label: "na$"     },
        { from:  35, to:   3, label: "$"       },
        { from:  35, to:   5, label: "na$"     }
    ]);

    // console.log(edges);
    // console.log(nodes);

    // create a network
    const container = document.getElementById("mynetwork");
    const data = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed"
            }
        },
        physics: {
            hierarchicalRepulsion: {
                avoidOverlap: 1
            }
        },
        nodes: {
            shape: "circle",
            color: "#FFFFFF"
        },
        edges: {
            color: "#AAAAAA"
        }
    };
    const network = new vis.Network(container, data, options);
}

Build_Tree();


/*
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
        { from: 1, to: 3, label: "banana" },
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

    const options = {
        layout: {
            hierarchical: {
                direction: "UD"
            }
        }
    };
    const network = new vis.Network(container, data, options);
*/