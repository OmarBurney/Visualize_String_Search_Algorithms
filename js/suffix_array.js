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


function Create_Mer_Table(title, mer_list, showRank = false) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;

    container = document.createElement("DIV");
    //container.id = "step-wrapper";

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
            if (property == "index") {
                cell = row.insertCell(-1);
                cell.innerHTML = mer_list[i][property] + 1;
                row.appendChild(cell);
            } else if (property != "rank" || showRank) {
                cell = row.insertCell(-1);
                cell.innerHTML = mer_list[i][property];
                row.appendChild(cell);
            }
        }
    }
    container.appendChild(table);

    return container;
}


function Create_String_Table(S) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;

    container = document.createElement("DIV");

    table = document.createElement("TABLE");
    table.border = 1;

    row = table.insertRow(-1);
    for (let i = 0 ; i < S.length ; i++) {
        cell = document.createElement("TH");
        cell.innerHTML = i + 1;
        row.appendChild(cell);
    }

    row = table.insertRow(-1);
    for (var i in S) {
        cell = row.insertCell(-1);
        cell.innerHTML = S[i];
        row.appendChild(cell);
    }
    container.appendChild(table);

    return container;
}


function Create_Step_Display(S, Mers) {
    let master_container = document.createElement("DIV");
    let row_container = null;
    let col_container = null;
    

    row_container = Create_String_Table(S + "$$$");
    master_container.appendChild(row_container);

    // Display Mod 1,2
    row_container = document.createElement("DIV");
    row_container.className = "row";
    col_container = Create_Mer_Table("MOD 1,2", Mers.kmers_12);
    col_container.className = "col-sm";
    row_container.appendChild(col_container);

    col_container = document.createElement("DIV");
    col_container.className = "col-sm";
    col_container.innerHTML = "RADIX<br/>SORT<br/>==>";
    row_container.appendChild(col_container);

    col_container = Create_Mer_Table("MOD 1,2", Mers.sorted_kmers_12, true);
    col_container.className = "col-sm";
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    // Display Mod 0
    row_container = document.createElement("DIV");
    row_container.className = "row";
    col_container = Create_Mer_Table("MOD 0", Mers.kmers_0);
    col_container.className = "col-sm"
    row_container.appendChild(col_container);

    col_container = document.createElement("DIV");
    col_container.className = "col-sm";
    col_container.innerHTML = "RADIX<br/>SORT<br/>==>";
    row_container.appendChild(col_container);

    col_container = Create_Mer_Table("MOD 0", Mers.sorted_kmers_0);
    col_container.className = "col-sm"
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    return master_container;
}


function Unique_Ranks(skmer_12) {
    let ranks = new Set();
    for (let i = 0 ; i < skmer_12.length ; i++) {
        if (ranks.has(skmer_12[i].rank)) {
            return false;
        } else {
            ranks.add(skmer_12[i].rank);
        }
    }
    return true;
}

function Suffix_Array(S) {
    let levels = [];
    let KMers = Create_3_Mers(S);
    levels.push({word: S, mers: KMers, SA: null})
    
    console.log(Unique_Ranks(KMers.sorted_kmers_12));
    while (!Unique_Ranks(KMers.sorted_kmers_12)) {
        let nS = "";
        // Append Mod 1s
        for (let i = 0 ; i < KMers.kmers_12.length ; i = i + 2) {
            nS += KMers.kmers_12[i].rank;
        }
        // Append Mod 2s
        for (let i = 1 ; i < KMers.kmers_12.length ; i = i + 2) {
            nS += KMers.kmers_12[i].rank;
        }
        console.log(nS);
        KMers = Create_3_Mers(nS);
        levels.push({word: nS, mers: KMers})
   }



   return levels;

}

function Display_Algo() {
    let S = text_input.value;
    let container = null;
    let steps = Suffix_Array(S);

    for (var i in steps) {
        console.log(steps[i]);

        container = document.createElement("DIV");
        container.innerHTML = "STEP " + i;
        document.getElementById("step-by-step").appendChild(container);

        container = Create_Step_Display(steps[i].word, steps[i].mers);
        container.id = "step-wrapper";
        document.getElementById("step-by-step").appendChild(container);
    }

}

function Update_Text() {
    console.log("update text");
}