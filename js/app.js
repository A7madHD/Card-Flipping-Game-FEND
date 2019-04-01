/*
 * Create a list that holds all of your cards
 */
const cards = ["fa fa-ring", "fa fa-ring", "fa fa-pen", "fa fa-pen", "fas fa-helicopter", "fas fa-helicopter", "fa fa-bolt", "fa fa-bolt",
    "fa fa-cube", "fa fa-cube", "fas fa-ice-cream", "fas fa-ice-cream", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle",
    "fa fa-coffee", "fa fa-coffee", "fa fa-bomb", "fa fa-bomb", "fa fa-flag", "fa fa-flag", "fa fa-cookie-bite", "fa fa-cookie-bite",
    "fas fa-newspaper", "fas fa-newspaper", "fas fa-snowflake", "fas fa-snowflake", "fas fa-chess-knight", "fas fa-chess-knight", "fas fa-flask", "fas fa-flask"];
var diff = [];
var opened = [];
var matched = [];
var shuffledCards;
var moves = 0;
var timer2 = 0;
var interv;
var matchy;
//modal for difficulty selection
$(document).ready(function () {
    $('#centralModal').modal({
        backdrop: 'static',
        keyboard: false
    })
});
//difficulties:
function easy() {
    diff = cards.slice(0, 16);
    start();
}
function normal() {
    diff = cards.slice(0, 24);
    $(".deck").addClass("deck-norm");
    start();
}
function hard() {
    diff = cards.slice(0, 32);
    $(".deck").addClass("deck-hard");
    start();
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 //start method
function start() {
    $(".moves").text(0);
    shuffledCards = shuffle(diff);
    for (var i = 0; i < shuffledCards.length; i++) {
        $(".deck").append("<li></li>").children().eq(i).addClass("card animated " + shuffledCards[i]);
    }
    var fiveMinutes = 60 * 5, display = $('.Timer');
    clearInterval(interv);
    startTimer(fiveMinutes, display);
    moves=0;
    $(".stars").children().children().removeClass("far fa-star").addClass( "fa fa-star");
}
//for starting the timer
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    interv = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.text(minutes + ":" + seconds);
        if (--timer < 0) {
            restart();
            timer = 0;
        }
        timer2 = minutes + ":" + seconds;
    }, 1000);
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// the query for getting the event listener is from https://stackoverflow.com/a/17811593
// the if statment is for making sure the player will not choose the card before the card is returend to it's normal classes.
$("ul.deck").on('click', 'li', function (e) {
    if (opened.length == 2) {
        opened.pop().prop('disabled',false);
        opened.pop().prop('disabled',false);
    }
    $(this).removeClass("wobble wrong fast show");
    show($(this));
    open($(this));
    move();
});
//for showing the logos and for flipping the cards.
function show(c) {
    if (opened.length == 0) {
        c.addClass("show open flipInY fast");
    } else {
        c.addClass("show")
    }
}
//for oppening the cards and check wether they match or not
function open(c) {
    if (opened.length > 0) {
        var d = opened[0];
        d.removeClass("open flipInY fast");
        console.log(c.attr("class"));
        if (d.attr("class") == c.attr("class")) {
            matchy = true;
            console.log(matchy);
            match(c, d);
        } else {
            wrong(c, d);
        }
    }
    if(!matchy||opened.length==0){
    opened.push(c);
    c.prop('disabled', true);
    }else{
    opened.pop();
    }
}
//if the cards do match, then this method is excuted
function match(c, d) {
    c.addClass("match show open shake");
    c.prop('disabled', true);
    d.addClass("match show open shake");
    d.prop('disabled', true);
    matched.push(c);
    matched.push(d);
    console.log(matched.length + " " + shuffledCards.length);
    if (matched.length == shuffledCards.length) {
        finish();
    }
}
//when cards do not match
function wrong(c, d) {
    c.addClass("wobble wrong fast show");
    d.addClass("wobble wrong fast show");
    setTimeout(function () { natural(c, d) }, 800);
}
//returning the cards to their natural state
function natural(c, d) {
    c.removeClass("wobble wrong fast");
    d.removeClass("wobble wrong fast");
    hideCard(c);
    hideCard(d);
}
//hiding the cards
function hideCard(c) {
    c.removeClass("show open flipInY");
    c.addClass("flipInY faster");
    c.prop('disabled',true);
    setTimeout(function () { c.removeClass("flipInY faster");  c.prop('disabled',false); }, 500);
}
//incrementing the moves
function move() {
    moves++;
    $(".moves").text(moves);
    if (moves == 20) {
        $(".stars").children().children().last().toggleClass("far fa-star fa fa-star");
    } else if (moves == 30) {
        $(".stars").children().children().eq(1).toggleClass("far fa-star fa fa-star");
    } else if (moves == 40) {
        $(".stars").children().children().first().toggleClass("far fa-star fa fa-star");
    }
}
//when the player finishes the game
function finish() {
    $('#centralModal').each(function (event) {
        var modal = $(this)
        modal.find('.modal-title').text('Congreatulations! You Won!')
        modal.find('.modal-body').text('You finished the game in ' + moves + ' moves! and ' + timer2 +
            ' minutes left!. if you want to play again please choose the difficulty');});
    $('#centralModal').modal(Option);
    diff = [];
    $(".deck").empty().removeClass("deck-norm deck-hard");
}
//when the player want to restart the game
function restart() {
    $('#centralModal').each(function (event) {
        var modal = $(this)
        modal.find('.modal-title').text('Lets Try again!')
        modal.find('.modal-body').text('if you want to play again please choose the difficulty');});
    $('#centralModal').modal(Option);
    diff = [];
    $(".deck").empty().removeClass("deck-norm deck-hard");
}
