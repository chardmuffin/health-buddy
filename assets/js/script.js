// GLOBAL VARS
var currentQuote = {author : "name", quote: "a quotation"}
var user = "";
var quoteTypes = ["zen"]; // default quote type. At least one type must be selected and user can override this default.
var favorites = []; // push a currentQuote here if user selects it as a favorite

// TODO:
// this function is called when the "settings" menu item is tapped
var showSettings = function() {

    //same content as firstTime but without welcome message

}

// TODO:
// this function is called when the "about" menu item is tapped
var showAbout = function() {

}

// TODO: finish this
// this function will ask the user for input (name, quote types, etc) if it is their first time using the app
var firstTime = function() {

    // if there is a name saved, it's not the first time, exit the function
    if (user) {
        return;
    }

    // TODO:
    // open a modal

    // brief welcome message

    // require user to enter their name

    // ask user to select types of quotes they'd like to see (checkboxes)
    // user must select at least one type

    // "You will be able to update these settings in the future"

    // (maybe) ask user to select app colors (optional - see primary, secondary, tertiary vars in css)

    // (maybe) ask user to choose font

    // save button closes modal

    setLocalStorage()
}

// TODO: add more types
// Maybe: fix the asynchronus thing and have this function return the quote object instead of setting a global var?
//
// this function updates currentQuote to a quote of type "type"
// where type = "kanye", "stoicism", "zen", "dadjoke":
//  {
//      author: "author name",
//      quote: "this is the quote"
//  }
//
// test with setQuote("type-goes-here") in console,
// then put currentQuote in console
var setQuote = async function(type) {
    var url = "";
    headers = {};
    if (type === "kanye") {
        url = "https://api.kanye.rest";
    }
    else if (type === "stoicism") {
        url = "https://noahs-server-proj1.herokuapp.com/https://api.themotivate365.com/stoic-quote";
    }
    else if (type === "zen") {
        url = "https://noahs-server-proj1.herokuapp.com/https://zenquotes.io/api/random";
    }
    else if (type === "dadjoke") {
        url = "https://icanhazdadjoke.com/"
        headers = {headers: {Accept: "application/json"}};
    }

    await fetch(url, headers)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error: " + response.statusText);
        }
    })
    .then(data => {
        //console.log(data);
        if (type === "kanye") {
            currentQuote.author = "Ye West";
            currentQuote.quote = data.quote;
        }
        else if (type === "stoicism") {
            // if the quote is from twitter, move the @ symbol from end of quote to front of the author's twitter username
            if (data.data.quote.slice(-1) === "@") {
                currentQuote.author = "@" + data.data.author;
                currentQuote.quote = data.data.quote.slice(0, -1);
            }
            else {
                currentQuote.author = data.data.author;
                currentQuote.quote = data.data.quote;
            }
        }
        else if (type === "zen") {
            currentQuote.author = data[0].a;
            currentQuote.quote = data[0].q;
        }
        else if (type === "dadjoke") {
            currentQuote.author = "icanhazdadjoke.com"
            currentQuote.quote = data.joke;
        }

        //if no author
        if (currentQuote.author.trim() === "") {
            currentQuote.author = "Unknown";
        }
    })
    .catch(error => {
        console.log("Unable to connect to " + type + " API: ");
        console.log(error);
    });
}

// displays a currentQuote
var displayQuote = async function() {

    // choose a random quote type from array of user specified types
    var type = quoteTypes[randomNumber(0, quoteTypes.length - 1)];

    await setQuote(type);
    document.getElementById("quotation").textContent = currentQuote.quote;
    document.getElementById("author").textContent = currentQuote.author;
}

// gets items in local storage and loads them into the global vars
var getLocalStorage = function() {
    user = localStorage.getItem("user");
    if (user) {
        quoteTypes = JSON.parse(localStorage.getItem("quoteTypes"));
        favorites = JSON.parse(localStorage.getItem("favorites"));
    }
}

//saves global vars in local storage
var setLocalStorage = function() {
    localStorage.setItem("user", user);
    localStorage.setItem("quoteTypes", JSON.stringify(quoteTypes));
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// utility function to generate a random numeric value between min and max, inclusive
var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// call initial functions
$(document).ready(getLocalStorage);
$(document).ready(firstTime)
$(document).ready(displayQuote);

// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);