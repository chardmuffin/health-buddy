// GLOBAL VARS
var currentQuote = {author : "name", quote: "a quotation"}
var user = null;
var contentTypes = []; // array to hold all the types of content user specified
var favorites = []; // push a currentQuote here if user selects it as a favorite
var settingsModalEl = document.getElementById("settings-modal");

// TODO:
// this function is called when the "settings" menu item is tapped
var showSettings = function() {

    //same content as firstTime but without welcome message
    //probably: put everything into one modal rather than several modals with "next" like in firstTime()

}

// TODO:
// this function is called when the "about" menu item is tapped
var showAbout = function() {

}

// TODO: finish this
// this function will ask the user for input (name, quote types, etc) if it is their first time using the app
var firstTime = function() {

    // if there is a name saved, it's not the first time, load a quote and exit the function
    if (localStorage.getItem("user") !== null) {
        displayQuote()
        return;
    }

    // show the settings modal with header for first time
    settingsModalEl.classList.add("is-active")
    document.querySelector(".modal-card-title").textContent = "Let's Get Started!";

    // (maybe) ask user to select app colors (optional - see primary, secondary, tertiary vars in css)

    // (maybe) ask user to choose font

    document.getElementById("first-time-modal-save").addEventListener("click", firstTimeSubmit);
}

// this function is called when the user tries to submit their info on first app visit
var firstTimeSubmit = function(event) {

    event.preventDefault();
    console.log("first time modal submit attempt")

    user = document.getElementById("name-input").value.trim();;
    var hasAdviceSlips = document.getElementById("advice-checkbox").checked;
    var hasDadJokes = document.getElementById("dad-checkbox").checked;
    var hasStoicism = document.getElementById("stoicism-checkbox").checked;
    var hasZen = document.getElementById("zen-checkbox").checked;
    var hasKanye = document.getElementById("kanye-checkbox").checked;
    var hasMeme = document.getElementById("meme-checkbox").checked;

    // is name entered?
    if (!user) {
        document.getElementById("name-danger").textContent = "Please enter your name";
    }
    else {
        document.getElementById("name-danger").textContent = "";
    }

    // is at least one checkbox selected?
    if (!(hasAdviceSlips || hasDadJokes || hasStoicism || hasZen || hasKanye || hasMeme)) {
        document.getElementById("checkbox-danger").textContent = "Please select at least one item";
    }
    else {
        document.getElementById("checkbox-danger").textContent = "";
    }

    // if name is entered and at least one checkbox selected, save settings and close modal
    if (user && (hasAdviceSlips || hasDadJokes || hasStoicism || hasZen || hasKanye || hasMeme)) {
        if (hasAdviceSlips) {
            contentTypes.push("advice")
        }
        if (hasDadJokes) {
            contentTypes.push("dadjoke")
        }
        if (hasStoicism) {
            contentTypes.push("stoicism")
        }
        if (hasZen) {
            contentTypes.push("zen")
        }
        if (hasKanye) {
            contentTypes.push("kanye")
        }
        if (hasMeme) {
            contentTypes.push("meme")
        }
        setLocalStorage()
        settingsModalEl.classList.remove("is-active")
        displayQuote();
    }
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
    var type = contentTypes[randomNumber(0, contentTypes.length - 1)];

    await setQuote(type);
    document.getElementById("quotation").textContent = currentQuote.quote;
    document.getElementById("author").textContent = currentQuote.author;
}

// gets items in local storage and loads them into the global vars
var getLocalStorage = function() {
    user = localStorage.getItem("user");
    if (user) {
        contentTypes = JSON.parse(localStorage.getItem("contentTypes"));
        favorites = JSON.parse(localStorage.getItem("favorites"));
    }
}

//saves global vars in local storage
var setLocalStorage = function() {
    localStorage.setItem("user", user);
    localStorage.setItem("contentTypes", JSON.stringify(contentTypes));
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// utility function to generate a random numeric value between min and max, inclusive
var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// call initial functions
$(document).ready(getLocalStorage);
$(document).ready(firstTime)

// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);