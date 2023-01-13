let express = require("express");
let path = require("path");

let createWord = require("./createWord").createWord;
let port = 9000;

app = express();

app.get("/word", function(request, response) {
    let word = createWord();
    response.send(word);
});

app.listen(port, function() {
    console.log("server listening on port " + port);
});