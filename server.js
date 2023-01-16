let express = require("express");
let path = require("path");
let http = require("http");
//let socketIo = require("socket.io");
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
const options = { 
    withCredentials: true,
    transports: ["websocket"],
 };

 const io = require('socket.io')(server, options);

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

    
/*
let io = socketIo(server, {
    cors: {
        origin: "file:///F:/SchoolStuff/COMP3006CW2/fantasyDictionary.html"
    }
});
*/

io.on('connection', function(socket) {
    console.log("Client connected:  ${socket.id}");
});

app.get("/", function(request, response) {
    response.render("fantasyDictionary");
});

app.get("/viewDictionary", async function(request, response) {
    
    createDictionary();
    
    response.render("dictionaryView", {
        words: { }
    });
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
            words: words[letterNumber]
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