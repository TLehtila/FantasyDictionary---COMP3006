let express = require("express");
let path = require("path");
let http = require("http");
let socketIo = require("socket.io");

let createWord = require("./createWord").createWord;
let createDictionary = require("./createDictionary").createDictionary;
let port = 9000;

let app = express();
let server = http.createServer(app);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


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


/*
let io = socketIo(server, {
    cors: {
        origin: "file:///F:/SchoolStuff/COMP3006CW2/fantasyDictionary.html"
    }
});
*/


app.get("/", function(request, response) {
    response.render("fantasyDictionary");
});


io.on('connection', function(socket) {
    console.log("Client connected:  ${socket.id}");
});

app.get("/word", function(request, response) {
    let word = createWord();
    response.send(word);
});

app.get("/create", function(request, response) {
    response.send(createDictionary());
    io.emit("creation done!");
});


server.listen(port, function() {
    console.log("server listening on port " + port);
});