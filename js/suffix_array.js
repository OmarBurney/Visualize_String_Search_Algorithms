// Created: 3/17/20
// By Omar Burney

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var text_input = document.getElementById("text_input");
var myButton = document.getElementById("runAlgo");

// Event Listeners
myButton.onclick = function() {Display_Algo()};
text_input.onchange = function() {Update_Text()};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class Three_Mer {
    constructor(index, chars) {
        this.index = index;
        this.chars = chars;
        this.rank = null;
    }
}


class Mer_lists {
    constructor(kmers_12, sorted_kmers_12, kmers_0, sorted_kmers_0) {
        this.kmers_12 = kmers_12;
        this.sorted_kmers_12 = sorted_kmers_12;
        this.kmers_0 = kmers_0;
        this.sorted_kmers_0 = sorted_kmers_0;
    }
}


function compare(a, b) {
    const merA = a.chars.toLowerCase();
    const merB = b.chars.toLowerCase();
    let comp = 0;

    if (merA < merB) { comp = -1; }
    else if (merA > merB) { comp = 1; }

    return comp;
}


function nextCharacter(c) { 
    return String.fromCharCode(c.charCodeAt(0) + 1); 
} 


function Create_3_Mers(myString) {
    let S = myString + "$$$";
    let kmers_12 = [];
    let kmers_0 = [];
    let sorted_kmers_12 = null;
    let sorted_kmers_0 = null;
    let temp_mer = null;

    for (let i = 0; i < S.length - 2; i++) {
        temp_mer = new Three_Mer(i, S.substring(i, i+3));
        
        if ( i % 3 == 0 || i % 3 == 1 ) { kmers_12.push(temp_mer); }
        else { kmers_0.push(temp_mer); }
    }

    sorted_kmers_12 = kmers_12.slice();
    sorted_kmers_0 = kmers_0.slice();
    sorted_kmers_12.sort(compare);
    sorted_kmers_0.sort(compare);

    sorted_kmers_12[0].rank = "A";
    for (let i = 1 ; i < sorted_kmers_12.length ; i++) {
        if (sorted_kmers_12[i-1].chars == sorted_kmers_12[i].chars) {
            sorted_kmers_12[i].rank = sorted_kmers_12[i-1].rank;
        } else {
            sorted_kmers_12[i].rank = nextCharacter(sorted_kmers_12[i-1].rank);
        }
    }
    
    return new Mer_lists(kmers_12, sorted_kmers_12, kmers_0, sorted_kmers_0);
}


function Create_Table(title, mer_list, showRank = false) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;

    container = document.createElement("DIV");
    container.id = "step-wrapper";

    table = document.createElement("TABLE");
    table.border = 1;
    
    row = table.insertRow(-1);
    cell = document.createElement("TH");
    cell.colSpan = "2";
    cell.innerHTML = title;
    row.appendChild(cell);
    if (showRank) {
        cell = document.createElement("TH");
        cell.innerHTML = "RANK";
        row.appendChild(cell);
    }

    for (let i = 0; i < mer_list.length ; i++) {
        row = table.insertRow(-1);
        for (var property in mer_list[i]) {
            if (property != "rank" || showRank) {
                cell = row.insertCell(-1);
                cell.innerHTML = mer_list[i][property];
                row.appendChild(cell);
            }
        }
    }
    container.appendChild(table);

    return container;
}


function Display_Algo() {
    let S = text_input.value;
    let Mers = Create_3_Mers(S);
    let container = null;

    container = Create_Table("MOD 1,2", Mers.kmers_12);
    document.getElementById("step-by-step").appendChild(container);
    container = Create_Table("MOD 1,2", Mers.sorted_kmers_12, true);
    document.getElementById("step-by-step").appendChild(container);
    container = Create_Table("MOD 0", Mers.kmers_0);
    document.getElementById("step-by-step").appendChild(container);
    container = Create_Table("MOD 0", Mers.sorted_kmers_0);
    document.getElementById("step-by-step").appendChild(container);
}

function Update_Text() {
    console.log("update text");
}