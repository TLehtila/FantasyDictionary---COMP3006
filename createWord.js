let consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
let vowels = ['a', 'e', 'i', 'o', 'u', 'y'];


//https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html

//consonant frequencies in the English language
//fudged a bit for easier, more even numbers
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

//vowel frequencies in the English language
//fudged a bit for easier, more even numbers
let vowelValues = {         //adds up to 40
    a: 8.5,
    e: 11.2,
    i: 7.6,
    o: 7.2,
    u: 3.7,
    y: 1.8
};

//averate word length in the English language is 4.7, but longer average creates more fun words
let averageWordLength = 8;

//runs through the word creation loop until the word is determined to end
function createWord() {
    let word = "";
    let wordEnd = false;
    
    while(!wordEnd) {
        let vowel = determineType(word);
        if(vowel == true) {
            word += addVowel();
        } else {
            word += addConsonant();
        }

        wordEnd = checkEnd(word);
    }

    return word;
}

//determines if next letter will be a vowel or consonant, returning true for vowel, false for consonant.
function determineType(word) {
    if(word.length < 2) {               //if 1 or 0 letters, use random type
            let type = Math.random() * 100; 
            if(type < 60) {
                return false;
            } else {
                return true;
            }
    } else { 
        //check the last two letters
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

        //if there is two vowels or two consonants in a row, use the other type. Otherwise use random.
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

//determine which vowel to add. Returns the letter.
function addVowel() {
    let value = Math.random() * 40
    let currentValue = 0;
    for(let i = 0; i < vowels.length; i++) {
        currentValue += vowelValues[vowels[i]];
        if(currentValue >= value) {
            return vowels[i];
        }
    }
}

//determine which consonant to add. Returns the letter.
function addConsonant() {
    let value = Math.random() * 60
    let currentValue = 0;
    for(let i = 0; i < consonants.length; i++) {
        currentValue += consonantValues[consonants[i]];
        if(currentValue >= value) {
            return consonants[i];
        }
    }
}

//check if the word should end. 
function checkEnd(word) {
    let endChance = word.length / (2 * averageWordLength);      //this is a nonsense calculation I came up with
    let randomChance = Math.random(101);

    //discourage too small words, only 1% should be under 3 letters
    //this lowers the chance of repeptitive words being generated
    if(word.length < 3) {
        if(randomChance > 1) {
            return false;
        }
    } else if(endChance > randomChance) {
        return true;
    }

    return false;
}

module.exports.createWord = createWord;