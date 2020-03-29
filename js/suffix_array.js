// Created: 3/17/20
// By Omar Burney

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var text_input = document.getElementById("text_input");
var myButton = document.getElementById("runAlgo");

// Event Listeners
myButton.onclick = function() {Display_Algo()};
text_input.onchange = function() {Update_Text()};

// Set up default Z Array
var ITER = 0;
var STEPS = 0;
var SuffixArraySteps = null;

// On 'Enter' Pressed
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        myButton.click();
    }
});


function Update_Text() {
    ITER = 0;
    document.getElementById("step-by-step").innerHTML = "";
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


class Three_Mer {
    constructor(index, chars) {
        this.index = index;
        this.chars = chars;
        this.rank = null;
    }
}


class MerLists {
    constructor(kmers_12, kmers_0) {
        this.kmers_12 = kmers_12;
        this.sorted_kmers_12 = kmers_12.slice();
        this.kmers_0 = kmers_0;
        this.sorted_kmers_0 = kmers_0.slice();

        this.sorted_kmers_12.sort(compare12Rank);
        this.sorted_kmers_0.sort(compare0Rank);
    }
}


function compareMer(a, b) {
    const merA = a.chars.toLowerCase();
    const merB = b.chars.toLowerCase();
    let comp = 0;

    if (merA < merB) { comp = -1; }
    else if (merA > merB) { comp = 1; }

    return comp;
}


function compare12Rank(a, b) {
    const merA = a.rank;
    const merB = b.rank;
    let comp = 0;

    if (merA < merB) { comp = -1; }
    else if (merA > merB) { comp = 1; }

    return comp;
}


function compare0Rank(a, b) {
    const merA = a.rank;
    const merB = b.rank;
    let comp = 0;

    if (merA.charAt(0) < merB.charAt(0)) { comp = -1; }
    else if (merA.charAt(0) > merB.charAt(0)) { comp = 1; }
    else if (parseInt(merA.substring(1)) < parseInt(merB.substring(1))) { comp = -1; }
    else if (parseInt(merA.substring(1)) > parseInt(merB.substring(1))) { comp = 1; }

    return comp;
}


function nextCharacter(c) { 
    return String.fromCharCode(c.charCodeAt(0) + 1); 
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


function Create_3_Mers(myString) {
    let S = myString;
    let m12 = [];
    let m0 = [];

    // Add all 3-mers into the appropriate list
    for (let i = 0; i < S.length - 2; i++) {
        temp_mer = new Three_Mer(i, S.substring(i, i+3));
        
        if ( i % 3 == 0 || i % 3 == 1 ) { m12.push(temp_mer); }
        else { m0.push(temp_mer); }
    }

    return {mer12: m12, mer0: m0};
}


function RankMer12List(merlist) {
    let sortedMers = merlist.slice();
    sortedMers.sort(compareMer);
    sortedMers[0].rank = "A";
    for (let i = 1 ; i < sortedMers.length ; i++) {
        if (sortedMers[i-1].chars == sortedMers[i].chars) {
            sortedMers[i].rank = sortedMers[i-1].rank;
        } else {
            sortedMers[i].rank = nextCharacter(sortedMers[i-1].rank);
        }
    }
}


function RankMer0List(merlist, dict) {
    for (let i = 0 ; i < merlist.length ; i++) {
        merlist[i].rank = merlist[i].chars[0] + dict[parseInt(merlist[i].index) + 1];
    }
}


function Merge_Mers(m12, m0, S12) {
    let mergedmer = [];
    let iter12 = 0;
    let iter0 = 0;

    if (m12.length == 0 && m0.length == 0) { return mergedmer; }
    if (m0.length == 0) { return m12; }
    if (m12.length == 0) { return m0; }

    while (iter12 < m12.length && iter0 < m0.length) {
        if (m12[iter12].chars < m0[iter0].chars) {
            mergedmer.push(m12[iter12]);
            iter12++;
        } else if (m12[iter12].chars > m0[iter0].chars) {
            mergedmer.push(m0[iter0]);
            iter0++;
        } else {
            if (m12.index % 3 == 0) {
                if (S12[iter12.index + 1] < S12[iter0 + 1]) {
                    mergedmer.push(m12[iter12]);
                    iter12++;
                } else {
                    mergedmer.push(m0[iter0]);
                    iter0++;
                }
            } else { // m12.index % 3 == 1
                if (S12[iter12.index + 2] < S12[iter0 + 2]) {
                    mergedmer.push(m12[iter12]);
                    iter12++;
                } else {
                    mergedmer.push(m0[iter0]);
                    iter0++;
                }
            }
        }
    }

    if (iter12 < m12.length) {
        for (;iter12 < m12.length ; iter12++) {
            mergedmer.push(m12[iter12]);
        }
    } else if (iter0 < m0.length) {
        for (;iter0 < m0.length ; iter0++) {
            mergedmer.push(m0[iter0]);
        }
    }
    
    return mergedmer;
}


function Suffix_Array(original_S) {
    let levels = [];
    let KMers = null;
    let S = original_S + "$$$";

    do {
        KMers = Create_3_Mers(S);
        RankMer12List(KMers.mer12)
        levels.push({word: S, mers: KMers, SA: {s12: null, s0: null, merged: null}});
        S = "";
        // Append Mod 1s
        for (let i = 0 ; i < KMers.mer12.length ; i = i + 2) { S += KMers.mer12[i].rank; }
        // Append Mod 2s
        for (let i = 1 ; i < KMers.mer12.length ; i = i + 2) { S += KMers.mer12[i].rank; }
        S += "$$$";
    } while (!Unique_Ranks(KMers.mer12));

    let d = {}
    let i = levels.length - 1;

    let SA12 = levels[i].mers.mer12.slice();
    let SA0 = levels[i].mers.mer0.slice();

    SA12.sort(compare12Rank);
    for (var j in SA12) {
        d[SA12[j].index] = (parseInt(j) + 1);
    }
    levels[i].SA.s12 = SA12;

    RankMer0List(KMers.mer0, d);
    SA0.sort(compare0Rank);
    levels[i].SA.s0 = SA0;

    levels[i].SA.merged = Merge_Mers(levels[i].SA.s12, levels[i].SA.s0, d);
    
    i--;
    let half = 0;
    while (i >= 0) {
        KMers = levels[i].mers;
        SA0 = levels[i].mers.mer0.slice();

        // convert SA of lower recursion to current level
        SA12 = levels[i+1].SA.merged.slice();
        half = Math.ceil((SA12.length - 1) / 2) - 1;
        d = {};
        for (let j = 0 ; j < SA12.length; j++) {
            if (SA12[j].index <= half) {
                d[3 * SA12[j].index] = j;
            } else {
                d[3 *(SA12[j].index - half - 1) + 1] = j;
            }
        }
        
        SA12 = new Array(levels[i].mers.mer12.length);
        for (var j in levels[i].mers.mer12) {
            SA12[d[levels[i].mers.mer12[j].index]] = levels[i].mers.mer12[j];
        }
        SA12.shift();
        
        levels[i].SA.s12 = SA12;
        RankMer0List(KMers.mer0, d);
        SA0.sort(compare0Rank);
        levels[i].SA.s0 = SA0;

        levels[i].SA.merged = Merge_Mers(levels[i].SA.s12, levels[i].SA.s0, d);
        i--;
    }


   return levels;
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


function Create_SA_Table(SA, label) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;

    container = document.createElement("DIV");

    table = document.createElement("TABLE");
    table.border = 1;

    row = table.insertRow(-1);
        cell = document.createElement("TH");
        cell.innerHTML = " ";
        row.appendChild(cell);
    for (let i = 0 ; i < SA.length ; i++) {
        cell = document.createElement("TH");
        cell.innerHTML = i + 1;
        row.appendChild(cell);
    }

    row = table.insertRow(-1);
        cell = document.createElement("TH");
        cell.innerHTML = label + "=";
        row.appendChild(cell);
    for (var i in SA) {
        cell = row.insertCell(-1);
        cell.innerHTML = SA[i].index + 1;
        row.appendChild(cell);
    }
    container.appendChild(table);

    return container;
}


function Create_Step_Display(S, step) {
    let master_container = document.createElement("DIV");
    let COLUMN = "col col-md-4 col-12";
    let row_container = null;
    let col_container = null;
    let Mers = new MerLists(step.mers.mer12, step.mers.mer0);

    row_container = Create_String_Table(S);
    row_container.id = "scrollable-table";
    master_container.appendChild(row_container);

    // Display Mod 1,2
    row_container = document.createElement("DIV");
    row_container.className = "row";
    col_container = Create_Mer_Table("MOD 1,2", Mers.kmers_12);
    col_container.className = COLUMN;
    row_container.appendChild(col_container);

    col_container = document.createElement("DIV");
    col_container.className = COLUMN;
    col_container.innerHTML = "<p>RADIX<br/>SORT<br/>==></p>";
    row_container.appendChild(col_container);

    col_container = Create_Mer_Table("MOD 1,2", Mers.sorted_kmers_12, true);
    col_container.className = COLUMN;
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    // Display Mod 0
    row_container = document.createElement("DIV");
    row_container.className = "row";
    col_container = Create_Mer_Table("MOD 0", Mers.kmers_0);
    col_container.className = COLUMN;
    row_container.appendChild(col_container);

    col_container = document.createElement("DIV");
    col_container.className = COLUMN;
    col_container.innerHTML = "<p>RADIX<br/>SORT<br/>==></p>";
    row_container.appendChild(col_container);

    col_container = Create_Mer_Table("MOD 0", Mers.sorted_kmers_0, true);
    col_container.className = COLUMN;
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    // Display SAs
    row_container = document.createElement("DIV");
    row_container.id = "scrollable-table";
    col_container = Create_SA_Table(step.SA.s12, "S12");
    col_container.className = COLUMN;
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    row_container = document.createElement("DIV");
    row_container.id = "scrollable-table";
    col_container = Create_SA_Table(step.SA.s0, "S0");
    col_container.className = COLUMN;
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    row_container = document.createElement("DIV");
    row_container.id = "scrollable-table";
    col_container = Create_SA_Table(step.SA.merged, "S");
    col_container.className = COLUMN;
    row_container.appendChild(col_container);
    master_container.appendChild(row_container);

    return master_container;
}


function Display_Algo() {
    let S = text_input.value;
    let container = null;

    if (ITER == 0) {
        SuffixArraySteps = Suffix_Array(S);
        STEPS = SuffixArraySteps.length;
    }

    if (ITER < STEPS) {
        container = document.createElement("DIV");
        container.innerHTML = "STEP " + ITER;
        container.id = "step-" + ITER;
        document.getElementById("step-by-step").appendChild(container);

        container = Create_Step_Display(SuffixArraySteps[ITER].word, SuffixArraySteps[ITER]);
        container.id = "step-wrapper";
        document.getElementById("step-by-step").appendChild(container);

        ITER++;
    }

}
