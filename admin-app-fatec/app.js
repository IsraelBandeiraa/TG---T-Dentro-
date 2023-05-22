$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("header.html");

    $('.carousel').carousel({
        interval: 500

    });
});