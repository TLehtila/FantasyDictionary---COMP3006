let express = require("express");
let path = require("path");
let http = require("http");
let socketIo = require("socket.io");
let mongoose = require("mongoose");
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require('mongodb').ObjectId;

let url = "mongodb://localhost:27017/dictionary";

let createWord = require("./createWord").createWord;
let createDictionary = require("./createDictionary").createDictionary;
let port = 9000;

let app = express();
let server = http.createServer(app);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

mongoose.set('strictQuery', false);

let io = socketIo(server);

io.on('connection', function(socket) {
    console.log("Client connected.");
    socket.on("dictionary created", function(message) {
        socket.emit("creation complete", message);
        console.log(message);
    });
});

app.get("/", function(request, response) {
    response.render("fantasyDictionary");
});

app.get("/viewDictionary", async function(request, response) {
    
    let success = createDictionary();
    
    if(success) {
        response.render("dictionaryView", {
            words: { },
            translation: "",
            translationMessage: ""
        });
    } else {
        response.render("fantasyDictionary");
        console.log("trouble connecting to the database");
    }
});

app.get("/translate*", async function(request, response) {
    let input = request.originalUrl.substring(10, request.originalUrl.length);
    
    input = input.toLowerCase();
    let inputArray = input.split("%20");        //that's a space

    let message = "Translation of \'";

    for(let i = 0; i < inputArray.length; i++) {
        message += inputArray[i] + " ";
    }

    message += "\' is: "

    translate(inputArray).then(
    function(translation) {
        response.render("dictionaryView", {
            translation: translation,
            words: { },
            translationMessage: message
        });
    }
    );
    
});

async function translate(inputArray) {
    const client = new MongoClient(url);

    let translated = "";
    try {
        const database = client.db("dictionary");
        const dictionary = database.collection("dictionary");

        const words = await dictionary.find({ }).toArray();


        for(let i = 0; i < inputArray.length; i++) {
            let letter = inputArray[i].substring(0, 1); 
            //console.log("current word = " + inputArray[i]);
            for(let j = 0; j < alphabet.length; j++) {
                if(alphabet[j] === letter) {
                    if(words[j][inputArray[i]] === undefined) {
                        translated += inputArray[i] + " ";
                    } else {
                        translated += words[j][inputArray[i]] + " ";
                    }
                    
                    break;
                }
            }
        }
        

    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }

    return translated;
}

app.get("/letter_*", async function(request, response) {
    let letterAddress = request.originalUrl.substring(1, request.originalUrl.length);
    
    let letterNumber = 0;

    for(let i = 0; i < alphabet.length; i++) {
        if(alphabet[i] === letterAddress.substring(letterAddress.length - 1, letterAddress.length)) {
            break;
        }
        letterNumber++;
    }

    const client = new MongoClient(url);
    
    try {
        const database = client.db("dictionary");
        const dictionary = database.collection("dictionary");

        const words = await dictionary.find({ }).toArray();

        response.render("dictionaryView", {
            words: words[letterNumber],
            translation: "",
            translationMessage: ""
        });

    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
});



app.get("/word", function(request, response) {
    let word = createWord();
    response.send(word);
});

server.listen(port, function() {
    console.log("server listening on port " + port);
});