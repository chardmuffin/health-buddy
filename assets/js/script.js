// GLOBAL VARS
var currentQuote = {author : "name", quote: "a quotation"}

// TODO:
// this function is called when the "settings" menu item is tapped
var showSettings = function() {

}

// TODO:
// this function is called when the "about" menu item is tapped
var showAbout = function() {

}

// TODO: add more types
// Maybe: fix the asynchronus thing and have this function return the quote object instead of setting a global var
//
// this function updates currentQuote to a quote of type "type"
// where type = "kanye", "stoicism", "zen":
//  {
//      quote: "this is the quote",
//      author: "author name"
//  }
var setQuote = async function(type) {
    var url = "";
    if (type === "kanye") {
        url = "https://api.kanye.rest";
    }
    else if (type === "stoicism") {
        url = "https://noahs-server-proj1.herokuapp.com/https://api.themotivate365.com/stoic-quote";
    }
    else if (type === "zen") {
        url = "https://noahs-server-proj1.herokuapp.com/https://zenquotes.io/api/random";
    }

    await fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error: " + response.statusText);
        }
    })
    .then(data => {
        console.log(data);
        if (type === "kanye") {
            currentQuote.author = "Ye West";
            currentQuote.quote = data.quote;
        }
        else if (type === "stoicism") {
            currentQuote.author = data.data.author;
            currentQuote.quote = data.data.quote;
        }
        else if (type === "zen") {
            currentQuote.author = data[0].a;
            currentQuote.quote = data[0].q;
        }
    })
    .catch(error => {
        console.log("Unable to connect to Stocism API: ");
        console.log(error);
    });
}

//test by uncommenting one below and typing "currentQuote" into the console

//setQuote("kanye");
//setQuote("stoicism");
//setQuote("zen");


// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);