// Created: 3/28/20
// By Omar Burney


/*import { DataSet } from "./node_modules/vis-data";
import { Network } from "./node_modules/vis-network/peer/esm/vis-network";
import "./node_modules/vis-network/styles/vis-network.css";
*/
 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var nextStepBtn = document.getElementById("nextStepBtn");
var text_input = document.getElementById("text_input");
var steps = document.getElementById("step-by-step");


// Event Listeners
document.addEventListener('keydown',function(e){
    if (e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13) {
        if(e.target.nodeName=='INPUT'&&e.target.type=='text') {
            e.preventDefault();
            window.getSelection().removeAllRanges();
            return false;
        }
    }
}, true);

nextStepBtn.onclick = function() {
    Display_Algo();
    // nextStepBtn.value = "Next Step";
};
text_input.oninput = function() {Update_Text()};

// On 'Enter' Pressed
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        nextStepBtn.click();
    }
});


var inputText = text_input.value;


function Update_Text() {
    document.getElementById("mynetwork").textContent = "";
}
// - - - - - - - -- - - - - - - -- - - - - -- - - - 


function Get_Suffix_Array(S) {
    let SA = [];
    for (let i = 0; i < S.length; i++) {
        SA.push({index:i, suffix: S.substring(i)})
    }
    
    SA.sort(function(a,b) {
        if (a.suffix < b.suffix) { return -1; }
        else if (a.suffix > b.suffix) { return 0; }
        return 0;
    });

    return SA.map(x => x.index);
}


function Get_Rank(SA) {
    let Rank = new Array(SA.length);

    for (let i = 0; i < SA.length; i++) {
        Rank[SA[i]] = i;
    }

    return Rank;
}


function Get_LCP(S) {
    let h = 0;
    let j = 0;
    let SA = Get_Suffix_Array(S);
    let Rank = Get_Rank(SA);
    let Height = new Array(S.length);
    Height[0] = 0;
    for (let i = 0; i < S.length; i++) {
        if (Rank[i] > 0) {
            j = SA[Rank[i]-1];
            while (i+h < S.length && j+h < S.length && S[i+h] == S[j+h]) {
                h++;
            }
            Height[Rank[i]] = h;
            if (h > 0) {
                h--;
            }
        }
    }

    return Height;
}


// Build Tree like an Adjacency List
function Build_Suffix_Tree(S, SA, LCP) {
    let Tree = [];
    SA = SA.map((a) => a + 1);              // shift indexes by 1 to start at 1

    // Initialize Tree
    Tree.push({id: 0, label: "", children: []});       // 0 represents root
    for (let x = 1; x <= S.length ; x++) {
        Tree.push({ id: x, label: "   " + x.toString() + "   ", children: [] });
    }
    
    // Insert Suffixes into Tree
    // { id: id_of_child, text: substring_on_edge }

    let walk = null;
    let newId = S.length + 1;
    let temp = 0;


    for (let i = 0; i < SA.length; i++) {
        if (LCP[i] === 0) {
            Tree[0]["children"].push({ id: SA[i], text: S.substring(SA[i]-1) })
        } else {
            temp = LCP[i];
            walk = Tree[0]["children"];
            while (!(temp < walk[walk.length - 1].text.length)) {
                temp -= walk[walk.length - 1].text.length;
                walk = Tree[walk[walk.length - 1].id].children;
            }

            if (temp === 0) {
                walk.push({ id: SA[i], text: S.substring(SA[i] - 1 + LCP[i]) });
            } else {
                Tree.push({ id: newId, label: "", children: [] });
                Tree[newId].children.push({ id: walk[walk.length - 1].id, text: walk[walk.length - 1].text.substring(temp)});
                Tree[newId].children.push({ id: SA[i], text: S.substring(SA[i] - 1 + LCP[i]) });
                walk[walk.length - 1].id = newId;
                walk[walk.length - 1].text = walk[walk.length - 1].text.substring(0, temp);
                newId += 1;
            }
        }
    }
    
    return Tree;
}


function Display_Tree(Tree) {
    // create an array with nodes
    let nodes = [];
    for (let x = 0; x < Tree.length; x++) {
        if ( x === 0 ) {
            nodes.push({ id: Tree[x].id, label: Tree[x].label, shape: "dot", color: "#000000", size: 5  })
        } else if ( Tree[x].label === "" ) {
            nodes.push({ id: Tree[x].id, label: Tree[x].label, shape: "dot", color: "#000000", size: 2  })
        } else {
            nodes.push({ id: Tree[x].id, label: Tree[x].label })
        }
    }

    // Create Array for storing depth of each node
    let depth = [];
    for (var x in Tree) {
        depth.push(0);
    }

    // Use BFS to find depth of each node
    let Q = [];
    Q.push(0);
    let dq = 0;
    while (Q.length != 0) {
        dq = Q.shift();
        if (dq < Tree.length) {
            for (let i = 0 ; i < Tree[dq].children.length ; i++ ) {
                depth[Tree[dq].children[i].id] = depth[dq] + 1;
                Q.push(Tree[dq].children[i].id);
            }
        }
    }

    // Apply node depths to graph visualizer
    for (let i = 0 ; i < depth.length ; i++) {
        try {
            nodes[i]["level"] = depth[i];
        } catch {
            ;
        }
    }

    // create an array with edges
    let edges = [];
    for (let i = 0 ; i < Tree.length ; i++) {
        for (let j = 0 ; j < Tree[i].children.length ; j++) {
            edges.push({ from: Tree[i].id, to: Tree[i].children[j].id, label: Tree[i].children[j].text });
        }
    }
    
    nodes = new vis.DataSet(nodes);
    edges = new vis.DataSet(edges);


    // create a network
    const container = document.getElementById("mynetwork");
    const data = {
        nodes: nodes,
        edges: edges
    };

    // Suffix Tree Layout Options
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
    network.enableEditMode();
}


function Display_Template_Tree() {
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
    network.enableEditMode();
}


function Display_Algo() {
    let S = inputText + "$";
    let SA = Get_Suffix_Array(S);
    let LCP = Get_LCP(S);
    console.log("Suffix Array", SA.map(a => a+1));
    console.log("LCP         ", LCP);
    let Tree = Build_Suffix_Tree(S, SA, LCP);
    //Display_Template_Tree();
    Display_Tree(Tree);
}



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