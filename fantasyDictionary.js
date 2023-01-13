let createWord = require("./createWord").createWord;

$(function() {

    $("#word").html(createWord());

});