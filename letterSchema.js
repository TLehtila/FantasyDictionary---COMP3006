let mongoose = require("mongoose");

let wordSchema = new mongoose.Schema({
    english: String, 
    nonsense: String
});

/*
let letterSchema = new mongoose.Schema({
    a: [
        {english: String, nonsense: String}
    ],
    b:  [
        {english: String, nonsense: String}
    ],
    c:  [
        {english: String, nonsense: String}
    ],
    d: [
        {english: String, nonsense: String}
    ],
    e: [
        {english: String, nonsense: String}
    ],
    f: [
        {english: String, nonsense: String}
    ],
    g: [
        {english: String, nonsense: String}
    ],
    h: [
        {english: String, nonsense: String}
    ],
    i: [
        {english: String, nonsense: String}
    ],
    j: [
        {english: String, nonsense: String}
    ],
    k: [
        {english: String, nonsense: String}
    ],
    l: [
        {english: String, nonsense: String}
    ],
    m: [
        {english: String, nonsense: String}
    ],
    n: [
        {english: String, nonsense: String}
    ],
    o: [
        {english: String, nonsense: String}
    ],
    p: [
        {english: String, nonsense: String}
    ],
    q: [
        {english: String, nonsense: String}
    ],
    r: [
        {english: String, nonsense: String}
    ],
    s: [
        {english: String, nonsense: String}
    ],
    t: [
        {english: String, nonsense: String}
    ],
    u: [
        {english: String, nonsense: String}
    ],
    v: [
        {english: String, nonsense: String}
    ],
    w: [
        {english: String, nonsense: String}
    ],
    x: [
        {english: String, nonsense: String}
    ],
    y: [
        {english: String, nonsense: String}
    ],
    z: [
        {english: String, nonsense: String}
    ]
});
*/


let Word = mongoose.model("word", wordSchema);
//let Letter = mongoose.model("letter", letterSchema);

module.exports.Word = Word;
//module.exports.Letter = Letter;