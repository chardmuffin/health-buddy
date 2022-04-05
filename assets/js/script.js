// GLOBAL VARS
var currentContent = {author : "name", quote: "a quotation", type: "theType"};
var user = null;
var contentTypes = []; // array to hold all the types of content user specified
var favorites = []; // push a currentContent here if user selects it as a favorite
var colors = [];
var preferencesModalEl = document.getElementById("settings-modal");
var preferencesModalHeaderTextEl = document.querySelector(".modal-card-title");
var aboutModalEl = document.getElementById("about-modal");
var favoritesModalEl = document.getElementById("favorites-modal");
var favoritesBodyEl = document.getElementById("favorites-body");
var savedTasks = []; //array to hold existing tasks previously saved
var completedTasks = [];
var addTaskMax = 2;

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

    //shows the right colors in the color pickers
    document.getElementById("primary").value = colors[0];
    document.getElementById("secondary").value = colors[1];
    document.getElementById("tertiary").value = colors[2];
    document.getElementById("fonts").value = colors[3];

    preferencesModalEl.addEventListener("click", preferencesClickHandler);
}

// function handles all clicks in update preferences modal, except submit button
var preferencesClickHandler = function(event) {

    // if clicked cancel, exit buttons, or the background:
    if (event.target.classList.contains("delete") || event.target.classList.contains("modal-background")) {

        // remove testing colors and reapply saved colors
        applyColors()
        preferencesModalEl.classList.remove("is-active");
    }
}

// TODO:
// this function is called when the "about" menu item is tapped
var showAbout = function() {
    aboutModalEl.classList.add("is-active")

    aboutModalEl.addEventListener("click",aboutModalClickHandler)
    // list sources for the quotes
    // (zen quotes requires this to be somewhere in the app:)
    // Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank">ZenQuotes API</a>

    // nice to have:
    // mission statement

    // nice to have:
    // suggestions?/feedback? link
}

var aboutModalClickHandler = function(event) {
     // if clicked cancel, exit buttons, or the background:
     if (event.target.classList.contains("delete") || event.target.classList.contains("modal-background")) {

        aboutModalEl.classList.remove("is-active");
    }
}

// TODO: maybe: finish this
// this function will ask the user for input (name, content types, etc) if it is their first time using the app
var firstTime = async function() {

    // if there is a name saved, then it's not the first time, load content and exit the function
    if (localStorage.getItem("user") !== null) {

        applyColors();
        await setContent(chooseContentType());
        displayContent();
        return;
    }

    // show the settings modal with header specified for first time
    preferencesModalEl.classList.add("is-active");
    preferencesModalHeaderTextEl.textContent = "Let's Get Started!";

    // TODO: (maybe) ask user to select app theme colors (optional)

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

        colors = [];
        var color1 = document.getElementById("primary").value;
        var color2 = document.getElementById("secondary").value;
        var color3 = document.getElementById("tertiary").value;
        var color4 = document.getElementById("fonts").value;

        colors.push(color1, color2, color3, color4);

        setLocalStorage();
        preferencesModalEl.classList.remove("is-active");

        //reload page
        applyColors();
        loadNavBar()
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

// TODO: add meme handling
// returns a div with class="content-card" that holds content
var generateContent = function(content) {
    var aContent = document.createElement("div");
    aContent.className = "column is-10";

    var theContent = document.createElement("div");
    if (content.type !== "dadjoke" && content.type !== "advice") {
        theContent.className = "is-italic"
    }
    var theAuthor = document.createElement("div");
    theAuthor.className = "has-text-centered"

    // create the heart button
    var theHeartContainer = document.createElement("div");
    theHeartContainer.className = "column";
    var theHeart = document.createElement("i");

    //if favorited, solid heart, else empty heart
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
        //remove author if dadjoke or advice
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

    //get the footer down
    getDownFooterComeOnGetDown();
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
        colors = JSON.parse(localStorage.getItem("colors"))
    }
}

//saves global vars in local storage
var setLocalStorage = function() {
    localStorage.setItem("user", user);
    localStorage.setItem("contentTypes", JSON.stringify(contentTypes));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("colors", JSON.stringify(colors));
    localStorage.setItem("storedTasks", JSON.stringify(savedTasks));
}

// applies saved colors to app
var applyColors = function() {
    document.documentElement.style.setProperty("--primary", colors[0]);
    document.documentElement.style.setProperty("--secondary", colors[1]);
    document.documentElement.style.setProperty("--tertiary", colors[2]);
    document.documentElement.style.setProperty("--dark", colors[3]);
}

//changes the colors visually (temporary) to help user decide on a color scheme
var testColors = function() {
    document.documentElement.style.setProperty("--primary", document.getElementById("primary").value);
    document.documentElement.style.setProperty("--secondary", document.getElementById("secondary").value);
    document.documentElement.style.setProperty("--tertiary", document.getElementById("tertiary").value);
    document.documentElement.style.setProperty("--dark", document.getElementById("fonts").value);
}

// puts the user's name in the nav bar
var loadNavBar = function() {
    if (user) {
        document.getElementById("user-name").textContent = user;
    }
}

// this function sets the Hero icon based on time of day
var generateHero = function() {
    var welcomeIcon = $('<img>');
    var iconContainerEl = $('#icon-container')
    var currentHour = new Date().getHours()
    
    // Clears the old icon 
    iconContainerEl.empty()

    if (currentHour >= 4  && currentHour < 12) {
        welcomeIcon.attr('src', './assets/images/good-morning-transparent.png')
    }
    else if (currentHour >= 12 && currentHour < 18) {
        welcomeIcon.attr('src', './assets/image/good-afternoon-transparent.png')
    }
    else {
        welcomeIcon.attr('src', './assets/images/good-evening-transparent.png')
    }

    iconContainerEl.append(welcomeIcon)
}

// utility function to generate a random numeric value between min and max, inclusive
var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// shows add-task modal when add-task button is clicked to have the user create a new task
var addTaskButtonHandler = function () {
    addTaskMax = JSON.parse(localStorage.getItem("addTaskMax"));
    var tasksList = document.getElementById("tasks-list");
    if (addTaskMax == tasksList.children.length || addTaskMax === 10 && addTaskMax == tasksList.children.length) {
        taskMaxMessage();
        return;
    }
    
    var addTaskModal = document.getElementById("add-task-modal");
    addTaskModal.classList.add("is-active");
    var addTaskField = document.getElementById("add-task-field"); //textarea box
    var saveChangesBtn = document.getElementById("save-added-task");

    //cancels out of add-tasks modal 
    addTaskModal.onclick = function(event) {
        var clickedElement = event.target;
        if(clickedElement.classList.contains("is-danger") || clickedElement.classList.contains("modal-background")) {
            addTaskModal.classList.remove("is-active");

            //remove any unsaved task from textarea
            addTaskField.value = "";
        } 
    }

    //save changes that will update the tasklists
    saveChangesBtn.onclick = function () { 

        if (addTaskField.value !== "") {
            var newTask = document.createElement("li");
            var taskLabel = document.createElement("label");
            var taskInput = document.createElement("input");

            taskLabel.classList.add("checkbox");
            taskLabel.textContent = addTaskField.value;
            taskLabel.setAttribute("style", "float: left");
            taskInput.setAttribute("style", "float: right");
            taskInput.setAttribute("type","checkbox");           
            addTaskField.value = "";

            //Save newly created task in localStorage
            var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
            if (storedTasks == null) {
                storedTasks = savedTasks;
            }
            savedTasks = storedTasks;
            savedTasks.push(taskLabel.textContent);
            setLocalStorage();

            newTask.append(taskInput, taskLabel);
            tasksList.appendChild(newTask);
            addTaskModal.classList.remove("is-active");

            getDownFooterComeOnGetDown();
        }

        addTaskField.setAttribute("placeholder", "Add a peaceful task :)"); 
    } 
}

// loads tasks the user previously created to continue where they left off
var loadTasks = function () {
    var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
    var tasksList = document.getElementById("tasks-list");
    var completedTasksPane = document.getElementById("completed-tasks");
    var dateHeading = document.querySelector("#tasks-list-container li ul");
    var taskTitle = document.querySelector("#tasks-list-container li ul:nth-child(2)");
    var dt = new Date().toLocaleString("en-us").split(",");
    var day = new Date().toLocaleString("en-us", {weekday: "long"});
    dt.length = 1;
    addTaskMax = JSON.parse(localStorage.getItem("addTaskMax")) ?? 2;
    localStorage.setItem("addTaskMax", JSON.stringify(addTaskMax));
    completedTasks = JSON.parse(localStorage.getItem("completedTasks"));

    var dtEl = document.createElement("li");
    dtEl.textContent = dt;

    var dayEl = document.createElement("li");
    dayEl.setAttribute("style", "font-size: 1.5rem; color: #fff");
    dayEl.textContent = day;
    dateHeading.append(dayEl, dtEl);

    var iconHolder = document.createElement("li");
    var titleIcon = document.createElement("i");
    titleIcon.classList.add("fa-solid");
    titleIcon.classList.add("fa-calendar-day");
    iconHolder.appendChild(titleIcon);
    taskTitle.appendChild(iconHolder);

    if (storedTasks !== null) {
        for (var task = 0; task < storedTasks.length; task++) {
            var newTask = document.createElement("li");
            var taskLabel = document.createElement("label");
            var taskInput = document.createElement("input");

            taskLabel.classList.add("checkbox");
            taskLabel.textContent = storedTasks[task];
            taskLabel.setAttribute("style", "float: left");
            taskInput.setAttribute("type","checkbox");
            taskInput.setAttribute("style", "float: right");
            newTask.append(taskInput, taskLabel);
            tasksList.appendChild(newTask);
        }

        if (completedTasks !== null) {
            for (var task = 0; task < completedTasks.length; task++) {
                var taskText = document.createElement("p");
                taskText.textContent = completedTasks[task];
                completedTasksPane.appendChild(taskText);
            }
        }
    }

    getDownFooterComeOnGetDown();
}

//mark tasks as complete to move them to the completed tasks pane
var markTaskComplete = function () {
    var checkedOffTasks = document.querySelectorAll("#tasks-list li input");
    var completeTaskBtn = document.getElementById("completed-task-btn");
    var tasksCounter = 0;
    for (var task = 0; task < checkedOffTasks.length; task++) {
        if (checkedOffTasks[task].checked === true) {
            completeTaskBtn.style.display = "inline-flex";

        }
        else if (checkedOffTasks[task].checked === false ) {
            tasksCounter += 1;
            if (tasksCounter == checkedOffTasks.length) {
                completeTaskBtn.style.display = "none";
            }
        }
    }
}

// move completed tasks to completed tasks pane for tracking accomplishments
var moveTasksToComplete = function () {
    var checkedOffTasks = document.querySelectorAll("#tasks-list li input");
    var completedTasksPane = document.getElementById("completed-tasks");
    var completeTaskBtn = document.getElementById("completed-task-btn");
    var completedTasks = JSON.parse(localStorage.getItem("completedTasks")) ?? [];

    for (var task = 0; task < checkedOffTasks.length; task++) {
        if (checkedOffTasks[task].checked === true) {
            var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
            var taskText = document.createElement("p");
            var taskLabel = checkedOffTasks[task].nextElementSibling;

            for (var stored = 0; stored < storedTasks.length; stored++) {
                if (storedTasks[stored] == taskLabel.textContent) {
                    const taskIndex = storedTasks.indexOf(storedTasks[stored]);
                    storedTasks.splice(taskIndex, 1);
                    localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
                }
            }
            taskText.textContent = taskLabel.textContent;
            completedTasks.push(taskText.textContent);
            localStorage.setItem("completedTasks",JSON.stringify(completedTasks));
            addTaskMax < 10 ? addTaskMax++ : addTaskMax = 10;
            localStorage.setItem("addTaskMax", JSON.stringify(addTaskMax));
            completedTasksPane.append(taskText);
            taskLabel.parentNode.remove();
            completeTaskBtn.style.display = "none";
        }
    }
}

// switches tasks panes, which will allow either current tasks or completed tasks to appear
var switchTasksPane = function (event) {
        var taskPane = event.target;
        var currentTasksBtn = document.getElementById("current-tasks-pane");
        var completedTasksBtn = document.getElementById("completed-tasks-pane");
        var currentTasks = document.getElementById("tasks-list");
        var completedTasksPane = document.getElementById("completed-tasks");
        
        if (currentTasksBtn.contains(taskPane)) {
            completedTasksBtn.classList.remove("is-active");
            completedTasksPane.style.display = "none";
            currentTasksBtn.classList.add("is-active");
            currentTasks.style.display = "flex";
        }
        else if (completedTasksBtn.contains(taskPane)) {
            currentTasksBtn.classList.remove("is-active");
            currentTasks.style.display = "none"
            completedTasksBtn.classList.add("is-active");
            completedTasksPane.style.display = "flex";
        }
}

// popup message when users try to create another task beyond the current task limit
var taskMaxMessage = function () {
    var maxMessageContainer = document.getElementById("task-max-message");
    var cancelButton = document.getElementById("message-cancel"); 
    var tasksTotalContainer = maxMessageContainer.querySelector("div:nth-child(2) span");

    tasksTotalContainer.textContent = `Currently at: ${addTaskMax}`;
    maxMessageContainer.style.display = "block";
    cancelButton.addEventListener("click", function () {
        maxMessageContainer.style.display = "none";
    })
}

// function is called when the task list and completed lists are rendered in order to create enough space for the footer
// prevents elements overlapping
var getDownFooterComeOnGetDown = function() {
    var footerHeight = $("#footer").height();
    console.log(footerHeight)

    $("#spacer").height(footerHeight + 40);
}

// call initial functions
$(document).ready(getLocalStorage);
$(document).ready(firstTime);
$(document).ready(loadNavBar);
$(document).ready(generateHero);

// this function calls generateHero every 60 seconds incase the time of day changes while the app is open
setInterval(function() {
    generateHero();
}, 60 * 1000)


// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);
document.getElementById("favorites").addEventListener("click", showFavorites);
document.getElementById("settings-modal-save").addEventListener("click", updatePreferences);
document.getElementById("content-container").addEventListener("click", handleClickHeart)
document.getElementById("primary").addEventListener("change", testColors);
document.getElementById("secondary").addEventListener("change", testColors);
document.getElementById("tertiary").addEventListener("change", testColors);
document.getElementById("fonts").addEventListener("change", testColors);
document.getElementById("add-new-task").addEventListener("click", addTaskButtonHandler);
document.getElementById("tasks-list").addEventListener("click", markTaskComplete)
document.getElementById("completed-task-btn").addEventListener("click",moveTasksToComplete);
document.getElementById("tasks-pane").addEventListener("click",switchTasksPane);
document.addEventListener("DOMContentLoaded", loadTasks);
