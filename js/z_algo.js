// Created: 3/16/20
// By Omar Burney
 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var nextStepBtn = document.getElementById("nextStepBtn");
var pattern_input = document.getElementById("pattern");
var text_input = document.getElementById("text_to_search");
var steps = document.getElementById("step-by-step");


// Event Listeners
nextStepBtn.onclick = function() {
    Display_Algo();
    nextStepBtn.value = "Next Step";
};
pattern_input.onchange = function() {Update_Text()};
text_input.onchange = function() {Update_Text()};


// Set up default Z Array
var ITER = 0;
var COUNT_FOR_Z = 0;
var Z = null;
var L = null;
var R = null;
var B = null;
var KP = null;
Update_Text()

// On 'Enter' Pressed
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        nextStepBtn.click();
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// FUNCTIONS


// Reset Algorithm Dependent Variables
function Update_Text() {
    ITER = 0;
    COUNT_FOR_Z = pattern_input.value.length + text_input.value.length + 1;
    steps.innerHTML = "";
    nextStepBtn.style.display = "block"
    nextStepBtn.value = "Initialize"
}


// Create Z-Array with Z-Algorithm
function Z_Algo(S) {
    let Z = [];
    let L = [];
    let R = [];
    let Kp = [];
    let B = [];
    let l = 0;
    let r = 0;
    let k_prime = null;
    let Beta = null;
    for (let i = 0 ; i < S.length ; i++) {
        Z.push(0);
        L.push(0);
        R.push(0);
        Kp.push(null);
        B.push(null);
    }

    for (let k = 1 ; k < Z.length ; k++) {
        if (k > r) {
            Z[k] = directCompare(S.substring(k), S);
            if (Z[k] != 0) {
                l = k;
                r = k + Z[k] - 1
            }
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
            Kp[k] = k_prime;
            B[k] = Beta;
        }
        L[k] = l;
        R[k] = r;
    }

    return {Zarray: Z, Larray: L, Rarray: R, Kparray: Kp, Barray: B};
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
    let caption = null;
    let table = null;
    let row = null;

    // Create New Step Elements
    container = document.createElement("DIV");
    container.id = "step-wrapper";
    table_title = document.createElement("P");
    table_title.innerHTML = "STEP k = " + (ITER+1).toString();
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
        if (L[ITER-1] <= i && i <= R[ITER-1]) {
            cell.id = "Z-box"
        }
        row.appendChild(cell);
    }

    container.appendChild(table);

    caption = document.createElement("P");
    if (ITER == 0) {
        caption.innerHTML = "Initializes first index to 0.";
    } else if (B[ITER] == null ) {
        caption.innerHTML = "k = " + (ITER+1).toString() + ", r = " + (R[ITER-1]+1).toString() + ". k > r, Direct compare.";
    } else {
        
        caption.innerHTML = "k' = " + (KP[ITER]+1).toString() + ", Zk' = " + Z[KP[ITER]].toString() + ", Beta =  " + B[ITER].toString() + ".";
        if (B[ITER] < Z[KP[ITER]]) {
            caption.innerHTML += "<br>Beta < Zk'.<br>Therefore, Zk = Beta.";
        } else if (B[ITER] > Z[KP[ITER]]) {
            caption.innerHTML += "<br>Beta > Zk'.<br>Therefore, Zk = Zk'.";
        } else {
            caption.innerHTML += "<br>Beta = Zk'.<br>Therefore, Zk = Beta + Direct Comparisons.";
        }
    }
    container.appendChild(caption);

    return container;
}


// Create Elements Displaying steps of Z-Algo
function Display_Algo() {   
    let P = pattern_input.value;
    let T = text_input.value;
    let S = P + "$" + T;
    let container = null;
    let temp = null;

    // Create Z Array for the first time
    if (ITER == 0) {
        temp = Z_Algo(S);
        Z = temp.Zarray;
        L = temp.Larray;
        R = temp.Rarray;
        B = temp.Barray;
        KP = temp.Kparray;
        console.log(temp);
    }

    // Build Table Step # ITER
    if (ITER < COUNT_FOR_Z) {
        // Create New Step Elements
        container = Create_Step_Display(S);
        document.getElementById("step-by-step").appendChild(container);
        ITER++;
        
        // Scroll to latest step
        window.scrollTo(0,document.body.scrollHeight);
    }
    if (ITER === COUNT_FOR_Z) {
        nextStepBtn.style.display = "none";
    }
}

