// GLOBAL VARS
var currentContent = {author : "name", quote: "a quotation", type: "theType"};
var user = null;
var contentTypes = []; // array to hold all the types of content user specified
var favorites = []; // push a currentContent here if user selects it as a favorite
var preferencesModalEl = document.getElementById("settings-modal");
var preferencesModalHeaderTextEl = document.querySelector(".modal-card-title");
var favoritesModalEl = document.getElementById("favorites-modal");
var favoritesBodyEl = document.getElementById("favorites-body");

// TODO: future development: add meme support
// this function is called when the "settings" menu item is tapped
var showSettings = function() {

    // show the settings modal with new header
    preferencesModalEl.classList.add("is-active");
    document.getElementById("preferences-close").classList.remove("is-invisible");
    preferencesModalHeaderTextEl.textContent = "Update Preferences";

    //remove first time settings help message
    document.getElementById("preferences-help-text").textContent = "";

    // fill name
    document.getElementById("name-input").value = user;

    // fill checkboxes
    if (contentTypes.includes("advice")) {
        document.getElementById("advice-checkbox").checked = true;
    }
    else {
        document.getElementById("advice-checkbox").checked = false;
    }
    if (contentTypes.includes("dadjoke")) {
        document.getElementById("dadjoke-checkbox").checked = true;
    }
    else {
        document.getElementById("dadjoke-checkbox").checked = false;
    }
    if (contentTypes.includes("stoicism")) {
        document.getElementById("stoicism-checkbox").checked = true;
    }
    else {
        document.getElementById("stoicism-checkbox").checked = false;
    }
    if (contentTypes.includes("zen")) {
        document.getElementById("zen-checkbox").checked = true;
    }
    else {
        document.getElementById("zen-checkbox").checked = false;
    }
    if (contentTypes.includes("kanye")) {
        document.getElementById("kanye-checkbox").checked = true;
    }
    else {
        document.getElementById("kanye-checkbox").checked = false;
    }
    /*if (contentTypes.includes("meme")) {
        document.getElementById("meme-checkbox").checked = true;
    }
    else {
        document.getElementById("meme-checkbox").checked = false;
    }*/
    if (contentTypes.includes("favorites")) {
        document.getElementById("favorites-checkbox").checked = true;
    }
    else {
        document.getElementById("favorites-checkbox").checked = false;
    }

    // update button text to "save"
    document.getElementById("settings-modal-save").textContent = "Save";

    // shows the favorites checkbox if favorites is not empty
    if (favorites.length > 0) {
        document.getElementById("favorites-checkbox").closest(".field").classList.remove("is-hidden");
    }
    else {
        document.getElementById("favorites-checkbox").closest(".field").classList.add("is-hidden")
    }

    preferencesModalEl.addEventListener("click", preferencesClickHandler);
}

// function handles all clicks in update preferences modal, except submit button
var preferencesClickHandler = function(event) {

    // if clicked cancel, exit buttons, or the background:
    if (event.target.classList.contains("delete") || event.target.classList.contains("modal-background")) {

        preferencesModalEl.classList.remove("is-active");
    }
}

// TODO:
// this function is called when the "about" menu item is tapped
var showAbout = function() {

    // list sources for the quotes
    // (zen quotes requires this to be somewhere in the app:)
    // Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank">ZenQuotes API</a>

    // nice to have:
    // mission statement

    // nice to have:
    // suggestions?/feedback? link
}

// TODO: maybe: finish this
// this function will ask the user for input (name, content types, etc) if it is their first time using the app
var firstTime = async function() {

    // if there is a name saved, then it's not the first time, load content and exit the function
    if (localStorage.getItem("user") !== null) {
        await setContent(chooseContentType());
        displayContent();
        return;
    }

    // show the settings modal with header specified for first time
    preferencesModalEl.classList.add("is-active");
    preferencesModalHeaderTextEl.textContent = "Let's Get Started!";

    // TODO: (maybe) ask user to select app theme colors (optional)
    // add radio buttons to html form

    // TODO: (maybe) ask user to choose font family (optional)
    // add radio buttons to html form
}

//TODO: future development: add meme support
// this function is called when the user tries to submit their info on first app visit, or when updating preferences
var updatePreferences = async function(event) {

    event.preventDefault();

    user = document.getElementById("name-input").value.trim();
    var hasAdviceSlips = document.getElementById("advice-checkbox").checked;
    var hasDadJokes = document.getElementById("dadjoke-checkbox").checked;
    var hasStoicism = document.getElementById("stoicism-checkbox").checked;
    var hasZen = document.getElementById("zen-checkbox").checked;
    var hasKanye = document.getElementById("kanye-checkbox").checked;
    //var hasMeme = document.getElementById("meme-checkbox").checked;
    var hasFavorites = document.getElementById("favorites-checkbox").checked;

    // is name entered?
    if (!user) {
        document.getElementById("name-danger").textContent = "Please enter your name";
    }
    else {
        document.getElementById("name-danger").textContent = "";
    }

    // is at least one checkbox selected?
    if (!(hasAdviceSlips || hasDadJokes || hasStoicism || hasZen || hasKanye /*|| hasMeme*/ || hasFavorites)) {
        document.getElementById("checkbox-danger").textContent = "Please select at least one item";
    }
    else {
        document.getElementById("checkbox-danger").textContent = "";
    }

    // if name is entered and at least one checkbox selected, save settings and close modal
    if (user && (hasAdviceSlips || hasDadJokes || hasStoicism || hasZen || hasKanye /*|| hasMeme*/ || hasFavorites)) {

        contentTypes = [];
        if (hasAdviceSlips) {
            contentTypes.push("advice");
        }
        if (hasDadJokes) {
            contentTypes.push("dadjoke");
        }
        if (hasStoicism) {
            contentTypes.push("stoicism");
        }
        if (hasZen) {
            contentTypes.push("zen");
        }
        if (hasKanye) {
            contentTypes.push("kanye");
        }
        /*if (hasMeme) {
            contentTypes.push("meme");
        }*/
        if (hasFavorites) {
            contentTypes.push("favorites")
        }
        setLocalStorage();
        preferencesModalEl.classList.remove("is-active");

        //load content into currentContent, generate and display html
        currentContent = {author : "name", quote: "a quotation", type: "theType"}
        await setContent(chooseContentType());
        displayContent();
    }
}

// TODO: add more types, "meme"
// for memes, probably store url in "quote" and caption in "author"
//
// this function updates currentContent to content of type "type"
// where type = "kanye", "stoicism", "zen", "dadjoke", "advice":
//  {
//      author: "author name",
//      quote: "this is the content"
//  }
//
// test with setContent("type-goes-here") in console,
// then put currentContent in console
var setContent = async function(type) {
    var url = "";
    headers = {};
    if (type === "favorites") {
        // select a random quote from list of favorites
        currentContent = favorites[randomNumber(0, favorites.length - 1)]
        return;
    }
    else if (type === "kanye") {
        url = "https://api.kanye.rest";
    }
    else if (type === "stoicism") {
        url = "https://noahs-server-proj1.herokuapp.com/https://api.themotivate365.com/stoic-quote";
    }
    else if (type === "zen") {
        url = "https://noahs-server-proj1.herokuapp.com/https://zenquotes.io/api/random";
    }
    else if (type === "dadjoke") {
        url = "https://icanhazdadjoke.com/";
        headers = {headers: {Accept: "application/json"}};
    }
    else if (type === "advice") {
        url = "https://api.adviceslip.com/advice";
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
        //console.log(data)
        if (type === "kanye") {
            currentContent.author = " - Ye West";
            currentContent.quote = '"' + data.quote + '"';
        }
        else if (type === "stoicism") {
            // if the quote is from twitter, move the @ symbol from end of quote to front of the author's twitter username
            if (data.data.quote.slice(-1) === "@") {
                currentContent.author = " - @" + data.data.author;
                currentContent.quote = '"' + data.data.quote.slice(0, -1) + '"';
            }
            else {
                currentContent.author = " - " + data.data.author;
                currentContent.quote = '"' + data.data.quote + '"';
            }
        }
        else if (type === "zen") {
            currentContent.author = " - " + data[0].a;
            currentContent.quote = '"' + data[0].q + '"';
        }
        else if (type === "dadjoke") {
            currentContent.author = " - icanhazdadjoke.com";
            currentContent.quote = data.joke;
        }
        else if (type === "advice") {
            currentContent.author = "none";
            currentContent.quote = data.slip.advice;
        }

        //if no author
        if (currentContent.author.trim() === "") {
            currentContent.author = " - Unknown";
        }

        //set type
        currentContent.type = type;
    })
    .catch(error => {
        console.log("Unable to connect to " + type + " API:");
        console.log(error);
    });
}

// TODO
// returns a div with class="content-card" that holds content
var generateContent = function(content) {
    var aContent = document.createElement("div");
    aContent.className = "column is-10";

    var theContent = document.createElement("div");
    var theAuthor = document.createElement("div");

    // create the heart button
    var theHeartContainer = document.createElement("div");
    theHeartContainer.className = "column";
    var theHeart = document.createElement("i");

    if (favorites.includes(content)) {
        theHeart.className = "fa-solid fa-heart";
    }
    else {
        theHeart.className = "fa-regular fa-heart";
    }
    theHeartContainer.appendChild(theHeart);

    if (content.type === "meme") {
        // TODO: Future Development: handle displaying a meme
    }
    else {
        if (content.type === "dadjoke" || content.type === "advice") {
            theAuthor.textContent = "";
        }
        else {
            theAuthor.textContent = content.author;
        }
        theContent.textContent = content.quote;
    }

    aContent.append(theContent, theAuthor);
    var totalContent = document.createElement("div");
    totalContent.className = "columns is-mobile content-card";

    totalContent.append(aContent, theHeartContainer);

    return totalContent;
}

// displays the currentContent
var displayContent = async function() {
    
    //clear whatever was there before
    document.getElementById("content-container").innerHTML = "";

    document.getElementById("content-container").appendChild(generateContent(currentContent));
}

// saves content to favorites
var handleClickHeart = function(event) {
    if (event.target.classList.contains("fa-regular")) {
        event.target.className = "fa-solid fa-heart";
        favorites.push(currentContent);
    }
    else if (event.target.classList.contains("fa-solid")) {
        event.target.className = "fa-regular fa-heart";
        const index = favorites.indexOf(currentContent);
        favorites.splice(index, 1)
    }

    setLocalStorage();
}

// displays favorite content saved by the user
var showFavorites = function() {
    favoritesModalEl.classList.add("is-active");
    
    for (content of favorites) {
        favoritesBodyEl.append(generateContent(content));
    }

    favoritesModalEl.addEventListener("click", favoritesClickHandler);
}

// TODO see below
// handles the favorites modal clicks
var favoritesClickHandler = function(event) {

    // if clicked save
    if (event.target.classList.contains("is-success")) {

        //temp array to build updated favorites list
        var tempFavorites = [];

        // get state of all the hearts
        var inputs = favoritesBodyEl.getElementsByTagName("i")

        var i = 0;
        for (var input of inputs) {
            if (input.classList.contains("fa-solid")) {
                // keep this index of favorites
                tempFavorites.push(favorites[i]);
            }
            i++;
        }

        favorites = tempFavorites;

        setLocalStorage()

        // edge case
        // if the currentContent was favorited on the home screen, then unfavorited here, updated home screen icon to empty heart
        if (!favorites.includes(currentContent)) {
            document.getElementById("content-container").getElementsByTagName("i")[0].className = "fa-regular fa-heart";
        }

        //edge case
        // if they unfavorite everything, remove favorites from list of types
        if (favorites.length === 0) {
            
            var index = contentTypes.indexOf("favorites")
            console.log(index)
            if (index > -1) {
                contentTypes.splice(index, 1)
            }

            // if favorites was the only type selected, change content type to zen by default
            if (contentTypes.length === 0) {
                contentTypes = ["zen"];
            }

            setLocalStorage();
        }
    }

    // if clicked save, cancel, exit buttons, or the background:
    if (event.target.classList.contains("delete") || event.target.classList.contains("button") || event.target.classList.contains("modal-background")) {

        favoritesBodyEl.innerHTML = "";
        favoritesModalEl.classList.remove("is-active");
    }
    
    //TODO
    else if (event.target.classList.contains("fa-heart")) {

        if (event.target.classList.contains("fa-regular")) {
            event.target.className = "fa-solid fa-heart";
        }
        else if (event.target.classList.contains("fa-solid")) {
            event.target.className = "fa-regular fa-heart";
        }
    }
}

// return a random content type from array of user specified types
var chooseContentType = function() {

    return contentTypes[randomNumber(0, contentTypes.length - 1)];
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
$(document).ready(firstTime);

// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);
document.getElementById("favorites").addEventListener("click", showFavorites);
document.getElementById("settings-modal-save").addEventListener("click", updatePreferences);
document.getElementById("content-container").addEventListener("click", handleClickHeart)