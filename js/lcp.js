// Created: 3/26/20
// By Omar Burney
 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var nextStepBtn = document.getElementById("nextStepBtn");
var text_input = document.getElementById("text_input");
var steps = document.getElementById("step-by-step");

document.addEventListener('keydown',function(e){
    if (e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13) {
        if(e.target.nodeName=='INPUT'&&e.target.type=='text') {
            e.preventDefault();
            window.getSelection().removeAllRanges();
            return false;
        }
    }
}, true);

// Event Listeners
nextStepBtn.onclick = function() {
    Display_Algo();
    nextStepBtn.value = "Next Step";
};

text_input.oninput = function() {Update_Text()};

// Set up default LCP data
var ITER = 0;
var COUNT_FOR_LCP = 0;
var S = null;
var SA = null;
var Rank = null;
var LCP = LCP;
Update_Text()



// On 'Enter' Pressed
document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        nextStepBtn.click();
    }
});

// Reset Algorithm Dependent Variables
function Update_Text() {
    ITER = -3;
    COUNT_FOR_LCP = text_input.value.length + 1;
    steps.innerHTML = "";
    document.getElementById("buttonWrap").style.display = "flex"
    nextStepBtn.value = "Initialize"
}


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


function Get_Height(S, SA, Rank) {
    let h = 0;
    let j = 0;
    Height = new Array(S.length);
    Height[0] = ".";
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


function Create_Iterable_Table(S, limit=S.length) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;
    let show = S.length;
    
    if (limit >= 0 && limit <= S.length) {
        show = limit;
    }

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
        if (i < show){
            cell.innerHTML = S[i];
        }
        row.appendChild(cell);
    }
    container.appendChild(table);

    return container;
}


function Create_SA_Table(SA, S) {
    let container = null;
    let table = null;
    let row = null;
    let cell = null;
    let suffixWrapper = null;

    container = document.createElement("DIV");

    table = document.createElement("TABLE");
    table.border = 1;

    row = table.insertRow(-1);
    for (let i = 0 ; i < SA.length ; i++) {
        cell = document.createElement("TH");
        cell.innerHTML = i + 1;
        row.appendChild(cell);
    }

    row = table.insertRow(-1);
    for (var i in SA) {
        cell = row.insertCell(-1);
        cell.innerHTML = SA[i] + 1;
        row.appendChild(cell);
    }
    container.appendChild(table);    
    
    row = table.insertRow(-1);
    for (var i in SA) {
        cell = row.insertCell(-1);
        cell.id = "vertical-cell";
        suffixWrapper = document.createElement("span");
        suffixWrapper.id = "vertical-text";
        suffixWrapper.innerHTML = S.substring(SA[i]);
        cell.appendChild(suffixWrapper);
        row.appendChild(cell);
    }
    container.appendChild(table);

    return container;
}


function Create_Step_Display(S, LCP, SA, stepNumber) {
    let wrapper = null,
        container = null;

    // Creater Wrapper for Step
    wrapper = document.createElement("DIV");
    wrapper.id = "step-wrapper";

    // Title of Table
    container = document.createElement("DIV");
    container.innerHTML = "Step " + (stepNumber + 1);
    wrapper.appendChild(container);

    // Build Table
    container = Create_Iterable_Table(LCP, stepNumber + 1);
    wrapper.appendChild(container);
    
    // Description
    container = document.createElement("p");
    if (stepNumber === 0) {
        container.innerHTML = "Initialize Empty List";
    } else {
        container.innerHTML = `Compare SUFF[${SA[stepNumber - 1] + 1}] = ${S.substring(SA[stepNumber - 1])} 
            and SUFF[${SA[stepNumber] + 1}] = ${S.substring(SA[stepNumber])}<br>
            Longest Common Prefix = ${LCP[stepNumber]}`;
    }
    wrapper.appendChild(container);

    return wrapper;
}

function Display_Algo() {
    let S = text_input.value + "$",
        container = null;
    
        console.log(ITER);
    if (ITER === -3) {
        SA = Get_Suffix_Array(S);
        Rank = Get_Rank(SA);
        LCP = Get_Height(S, SA, Rank);

        // Display String
        container = document.createElement("DIV");
        container.innerHTML = "String";
        steps.appendChild(container);
        container = Create_Iterable_Table(S);
        steps.appendChild(container);

    } else if (ITER === -2) {
        // Display Suffix Array
        container = document.createElement("DIV");
        container.innerHTML = "Suffix Array";
        steps.appendChild(container);
        container = Create_SA_Table(SA, S)
        steps.appendChild(container);

    } else if (ITER === -1) {
        // Display Rank
        container = document.createElement("DIV");
        container.innerHTML = "Rank (Inverse of Suffix Array: Rank[Suffix_Array[i]] = i)";
        steps.appendChild(container);
        container = Create_Iterable_Table(Rank.map(x => x+1))
        steps.appendChild(container);

    } else if (ITER === 0) {
        // Display LCPs
        container = document.createElement("DIV");
        container.innerHTML = "Now Find Longest Common Prefix Between Adjacent Suffixes in Suffix Array";
        steps.appendChild(container);

    }
    if (ITER < COUNT_FOR_LCP) {
        if (ITER >= 0) {
            container = Create_Step_Display(S, LCP, SA, ITER);
            steps.appendChild(container);
        }
        ITER++;

        // Scroll to latest step
        window.scrollTo(0,document.body.scrollHeight);
    }
    
    if (ITER === COUNT_FOR_LCP) {
        document.getElementById("buttonWrap").style.display = "none";
    }
}