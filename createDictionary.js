let wordlist = require("wordlist-english");
let http = require("http");
let mongoose = require("mongoose");

let url = "mongodb://localhost:27017/dictionary";

let createWord = require("./createWord").createWord;
//let Word = require("./letterSchema").Word;

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

async function createDictionary() {
    let words = wordlist['english/10'];

    console.log(words.length);

    let nonsenseDictionary = {};

    for(let i = 0; i < words.length; i++) {
        let nonsense = createWord();
        let english = words[i];
        //console.log("english: " + english + " - nonsense: " + nonsense);
        nonsenseDictionary[english] = nonsense;
    }


    mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
    const db = mongoose.connection;
 
    for(let i = 0; i < alphabet.length; i++) {
        let document = JSON.parse(createDocument(nonsenseDictionary, words, i));
        await db.collection("dictionary").insertOne(document);
    }

    mongoose.connection.close();
    
    //let inserted = Word.collection.insertMany(nonsenseDictionary["word"]);
    //console.log(inserted + " inserted");
    return nonsenseDictionary;
}

function createDocument(nonsenseDictionary, words, alphabetIndex) {
    let document = "{ ";
    for(let i = 0; i < words.length; i++) {
        let word = words[i];
        if(words[i].charAt(0) == alphabet[alphabetIndex]) {
            //document += "\"english\": \"" + word + "\", \"nonsense\": \"" + nonsenseDictionary[word] + "\", ";
            document += "\"" + word + "\": \"" + nonsenseDictionary[word] + "\", ";
        }
    }

    if(document.length > 2) {
        document = document.substring(0, document.length - 2);      //remove last ", "
    }
    document += " }";

    console.log(document);
    return document;
}



module.exports.createDictionary = createDictionary;