import { io } from "socket.io-client";
const socket = io.connect("http://localhost:9000");

//let createWord = require("./createWord").createWord;
//let createDictionary = require("./createDictionary").createDictionary;

$(function() {

    $("#createDictionary").click(function() {
        console.log("clicked");
        window.location = "/create";
    });

    let socket = io("http://localhost:9000");
    socket.on("received nessage", function(msg) {
        notifyUser();
    });


}); 

function notifyUser() {
    window.alert("dictionary created!");
}