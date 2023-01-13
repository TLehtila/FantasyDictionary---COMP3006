let wordlist = require("wordlist-english");
let http = require("http");
let mongoose = require("mongoose");

let url = "mongodb://localhost:27017/dictionary";

let createWord = require("./createWord").createWord;

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function createDictionary() {
    let words = wordlist['english/10'];

    console.log(words.length);




}



module.exports.createDictionary = createDictionary;