// Created: 3/17/20
// By Omar Burney

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Connect to HTML components
var text_input = document.getElementById("text_input");
var myButton = document.getElementById("runAlgo");

// Event Listeners
myButton.onclick = function() {Display_Algo()};
text_input.onchange = function() {Update_Text()};

class Three_Mer {
    constructor(index, chars) {
        this.index = index;
        this.chars = chars;
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

function SA_Algo(myString) {
    let S = myString + "$$$";
    let kmers_12 = [];
    let kmers_0 = [];
    let temp_mer = null;

    for (let i = 0; i < S.length - 2; i++) {
        temp_mer = new Three_Mer(i, S.substring(i, i+3));
        
        if ( i % 3 == 0 || i % 3 == 1 ) { kmers_12.push(temp_mer); }
        else { kmers_0.push(temp_mer); }
    }

    // !!! TODO
    // !!! Before Sorting, Display Unsorted 3-mers
    // !!! After Sorting, Display sorted 3-mers

    kmers_12.sort(compare);
    kmers_0.sort(compare);
    console.log(kmers_12);
    console.log(kmers_0);
}

function Display_Algo() {
    let S = text_input.value;
    SA_Algo(S);
    console.log("display algo");
}

function Update_Text() {
    console.log("update text");
}