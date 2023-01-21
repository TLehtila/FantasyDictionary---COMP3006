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


//https://stackoverflow.com/a/64730022
/*
const options = { 
    withCredentials: true,
    transports: ["websocket"],
 };
*/

 //const io = require('socket.io')(server, options);

//https://stackoverflow.com/a/70569160
/*
const io = require("socket.io")(server, {
    path: '/api/socket.io',
});

if (process.env.NODE_ENV === 'development') {
    io.engine.on('initial_headers', (headers, req) => {
        headers['Access-Control-Allow-Origin'] = 'http://localhost:9000';
        headers['Access-Control-Allow-Credentials'] = true;
    });

    io.engine.on('headers', (headers, req) => {
        headers['Access-Control-Allow-Origin'] = 'http://localhost:9000';
        headers['Access-Control-Allow-Credentials'] = true;
    });
}
*/

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
            translation: ""
        });
    } else {
        response.render("fantasyDictionary");
        console.log("trouble connecting to the database");
    }
    //trying to check if a dictionary already exists, doesn't work
    /*
    const client = new MongoClient(url);

    try {
        const database = client.db("dictionary");
        const dictionary = database.collection("dictionary");
        
        dictionary.count(function (err, count) {
            console.log(count);
            
            if (!err && count === 0) {
                createDictionary();
            }
            
        });
        response.render("dictionaryView", {
            words: { }
        });

    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }

    */
});

app.get("/translate*", async function(request, response) {
    let input = request.originalUrl.substring(10, request.originalUrl.length);
    //console.log(input);
    
    let inputArray = input.split("%20");        //that's a space

    translate(inputArray).then(
       function(translation) {
        console.log(translation);
        response.render("dictionaryView", {
            translation: translation,
            words: { }
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
            translation: ""
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