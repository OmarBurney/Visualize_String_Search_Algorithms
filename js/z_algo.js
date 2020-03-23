// Created: 3/16/20
// By Omar Burney
 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var myButton = document.getElementById("runAlgo");
var pattern_input = document.getElementById("pattern");
var text_input = document.getElementById("text_to_search");
var steps = document.getElementById("step-by-step");

// Event Listeners
myButton.onclick = function() {Display_Algo()};
pattern_input.onchange = function() {Update_Text()};
text_input.onchange = function() {Update_Text()};

// Set up default Z Array
var ITER = 0;
var COUNT_FOR_Z = 0;
var Z = null;
var L = null;
var R = null;
Update_Text()

// On 'Enter' Pressed
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        myButton.click();
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// FUNCTIONS


// Reset Algorithm Dependent Variables
function Update_Text() {
    ITER = 0;
    COUNT_FOR_Z = pattern_input.value.length + text_input.value.length + 1;
    steps.innerHTML = "";
}


// Create Z-Array with Z-Algorithm
function Z_Algo(S) {
    let Z = [];
    let l = 0;
    let r = 0;
    let k_prime = null;
    let Beta = null;
    for (let i = 0 ; i < S.length ; i++) {
        Z.push(0)
    }

    for (let k = 1 ; k < Z.length ; k++) {
        if (k > r) {
            Z[k] = directCompare(S.substring(k), S);
            l = k;
            r = k + Z[k] - 1
        } else {
            k_prime = k - l;
            Beta = r - k + 1;
            if (Z[k_prime] < Beta) {
                Z[k] = Z[k_prime]
            } else if (Z[k_prime] > Beta) {
                Z[k] = Beta;
            } else {
                Z[k] = Beta + directCompare(S.substring(r+1), S.substring(Z[k_prime]))
                l = k;
                r = k + Z[k] - 1;
            }
        }
    }

    return Z;
}


// Compare two strings, return prefix match count
function directCompare(A, B) {
    let count = 0;
    let limit = Math.min(A.length, B.length)
    for (let i = 0 ; i < limit ; i++) {
        if (A.charAt(i) != B.charAt(i)) { break; }
        count++;
    }

    return count;
}


function Create_Step_Display(S) {
    let container = null;
    let table_title = null;
    let table = null;
    let row = null;

    // Create New Step Elements
    container = document.createElement("DIV");
    container.id = "step-wrapper";
    table_title = document.createElement("P");
    table_title.innerHTML = "STEP " + ITER.toString();
    container.appendChild(table_title);

    table = document.createElement("TABLE");
    table.border = 1;

    // Index Number Row
    row = table.insertRow(-1);
    for (let i = 0 ; i < S.length ; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = i + 1;
        row.appendChild(headerCell);
    }
    
    // String Character Row
    row = table.insertRow(-1);
    for (let i = 0 ; i < S.length ; i++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = S[i];
        row.appendChild(cell);
    }

    // Z Array Row
    row = table.insertRow(-1);
    for (let i = 0 ; i < S.length ; i++) {
        cell = row.insertCell(-1);
        if (i <= ITER) {
            cell.innerHTML = Z[i];
        }
        if (L <= i && i <= R) {
            cell.id = "Z-box"
        }
        row.appendChild(cell);
    }

    container.appendChild(table);
    return container;
}


// Create Elements Displaying steps of Z-Algo
function Display_Algo() {   
    let P = pattern_input.value;
    let T = text_input.value;
    let S = P + "$" + T;
    let container = null;

    // Create Z Array for the first time
    if (ITER == 0) {
        Z = Z_Algo(S);
        L = 0;
        R = 0;
    }

    // Build Table Step # ITER
    if (ITER < COUNT_FOR_Z) {
        if (Z[ITER] != 0) {
            L = ITER;
            R = ITER + Z[ITER] - 1;
        }
        // Create New Step Elements
        container = Create_Step_Display(S);
        document.getElementById("step-by-step").appendChild(container);
        ITER++;
        
        // Scroll to latest step
        window.scrollTo(0,document.body.scrollHeight);
    }
}

