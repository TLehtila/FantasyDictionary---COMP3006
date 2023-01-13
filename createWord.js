let consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
let vowels = ['a', 'e', 'i', 'o', 'u', 'y'];


//https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html

let consonantValues = {     //adds up to 60
    b: 2.0, 
    c: 4.5, 
    d: 3.4, 
    f: 1.8, 
    g: 2.4, 
    h: 3.0, 
    j: 0.3, 
    k: 1.1, 
    l: 5.5,
    m: 3.0,
    n: 6.6,
    p: 3.3,
    q: 0.3, 
    r: 7.6,
    s: 5.7, 
    t: 7.0,
    v: 1.0,
    w: 1.3,
    x: 0.2,
    z: 0.2
};

let vowelValues = {         //adds up to 40
    a: 8.5,
    e: 11.2,
    i: 7.6,
    o: 7.2,
    u: 3.7,
    y: 1.8
};

let averageWordLength = 5;

function createWord() {
    let word = "";
    let wordEnd = false;
    
    while(!wordEnd) {
        let vowel = determineType(word);
        if(vowel == true) {
            word = addVowel(word);
        } else {
            word = addConsonant(word);
        }
        wordEnd = checkEnd(word);
    }

    return word;
}

function determineType(word) {

    if(word.length < 3) {
            let type = Math.random() * 100; 
            if(type < 60) {
                return false;
            } else {
                return true;
            }
    } else {
        let vowel1 = false;
        let vowel2 = false;

        for(let i = 0; i < vowels.length; i++) {
            if(word.charAt(word.length - 1) ==  vowels[i]) {
                vowel1 = true;
            }
            if(word.charAt(word.length - 2) ==  vowels[i]) {
                vowel2 = true;
            }
        }

        if(vowel1 && vowel2) {
            return false;
        } else if(!vowel1 && !vowel2) {
            return true;
        } else {
            type = Math.random() * 100;
            if(type < 60) {
                return false;
            } else {
                return true;
            }
        }
    }
}

function addVowel(word) {
    let value = Math.random() * 41
    let currentValue = 0;
    for(let i = 0; i < vowels.length; i++) {
        currentValue += vowelValues[vowels[i]];
        if(currentValue >= value) {
            word += vowels[i];
            return word;
        }
    }
}

function addConsonant(word) {
    let value = Math.random() * 61
    let currentValue = 0;
    for(let i = 0; i < consonants.length; i++) {
        currentValue += consonantValues[consonants[i]];
        if(currentValue >= value) {
            word += consonants[i];
            return word;
        }
    }
}

function checkEnd(word) {
    let endChance = word.length / (2 * averageWordLength);
    let randomChance = Math.random(101);

    if(endChance > randomChance) {
        return true;
    }

    if(word.length == 1) {
        if(randomChance > 5) {
            return false;
        }
    }

    return false;
}

module.exports.createWord = createWord;