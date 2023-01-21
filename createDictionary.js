let wordlist = require("wordlist-english");
let mongoose = require("mongoose");

let url = "mongodb://localhost:27017/dictionary";

let createWord = require("./createWord").createWord;

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

async function createDictionary() {
    //10% most used english words
    let words = wordlist['english/10'];
    console.log(words.size);
    let nonsenseDictionary = {};

    //create a nonsense word list, assign one to each english word
    for(let i = 0; i < words.length; i++) {
        let nonsense = createWord();
        let english = words[i];
        nonsenseDictionary[english] = nonsense;
    }


    mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
    const db = mongoose.connection;
    if(mongoose.connection.readyState === 1) {
        for(let i = 0; i < alphabet.length; i++) {
            let document = JSON.parse(createDocument(nonsenseDictionary, words, i));
            await db.collection("dictionary").insertOne(document);
        }
    
        mongoose.connection.close();
    } else {
        console.log("mongoose connection state: " + mongoose.connection.readyState);
        return false;
    }
    return true;
} 

function createDocument(nonsenseDictionary, words, alphabetIndex) {
    //start the json and set the id field to "letter_<letter>"
    let document = "{ \"_id\": \"letter_" + alphabet[alphabetIndex] + "\", ";
    for(let i = 0; i < words.length; i++) {
        //go through the english wordlist, take the words starting with current letter
        if(words[i].charAt(0) == alphabet[alphabetIndex]) {
            document += "\"" + words[i] + "\": \"" + nonsenseDictionary[words[i]] + "\", ";
        }
    }

    if(document.length > 2) {
        document = document.substring(0, document.length - 2);      //remove last ", "
    }
    //end the json
    document += " }";

    return document;
}



module.exports.createDictionary = createDictionary;