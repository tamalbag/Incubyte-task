// Main function to add numbers
function add(numbers) {
    if (numbers === "") return 0;

    const { delimiters, numberString } = parseDelimiters(numbers);
    const numberArray = splitNumbers(numberString, delimiters);
    checkForNegatives(numberArray);

    return sumFilteredNumbers(numberArray);
}

// Parse delimiters from the input string
function parseDelimiters(numbers) {
    let delimiters = /[\n,]/;  // Default delimiters
    let numberString = numbers;

    if (numbers.startsWith("//")) {
        const [delimiterPart, rest] = numbers.slice(2).split('\n', 2);
        delimiters = delimiterPart.startsWith('[')
            ? createMultiDelimiterRegExp(delimiterPart.slice(1, -1))
            : new RegExp(escapeSpecialChars(delimiterPart));
        numberString = rest;
    }

    return { delimiters, numberString };
}


function createMultiDelimiterRegExp(delimiterPart) {
    // Remove surrounding brackets
    delimiterPart = delimiterPart.replace(/^\[|\]$/g, '');
    
    // Split by '][' and escape special characters
    const delimiters = delimiterPart
        .split('][')
        .map(d => escapeSpecialChars(d))
        .join('|');
    
    // Return a new RegExp to match any of the delimiters
    return new RegExp(delimiters);
}


// Escape special characters in delimiters
function escapeSpecialChars(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

// Split numbers by delimiters and convert them to an array of numbers
function splitNumbers(numberString, delimiters) {
    return numberString.split(delimiters).map(Number);
}

// Check for negative numbers and throw an error if any are found
function checkForNegatives(numberArray) {
    const negatives = numberArray.filter(n => n < 0);
    if (negatives.length) {
        throw new Error(`Negatives not allowed: ${negatives.join(", ")}`);
    }
}

// Sum the numbers, ignoring those greater than 1000
function sumFilteredNumbers(numberArray) {
    return numberArray
        .filter(n => n <= 1000)
        .reduce((sum, num) => sum + num, 0);
}

// Test cases
console.log(add(""));               // Output: 0
console.log(add("1"));              // Output: 1
console.log(add("1,5"));            // Output: 6
console.log(add("1,2,3,4,5"));      // Output: 15
console.log(add("1\n2,3"));         // Output: 6
console.log(add("//;\n1;2"));       // Output: 3
console.log(add("//[***]\n1***2****3")); // Output: 6
console.log(add("//[*][%]\n1*2%3")); // Output: 6
console.log(add("2,1001"));         // Output: 2
console.log(add("//[***][%%%]\n1***2%%%3")); // Output: 6

try {
    console.log(add("1,-2,3,-4"));
} catch (e) {
    console.log(e.message);         // Output: Negatives not allowed: -2, -4
}
