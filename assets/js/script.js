// GLOBAL VARS
var currentContent = {author : "name", quote: "a quotation"}
var user = null;
var contentTypes = []; // array to hold all the types of content user specified
var favorites = []; // push a currentContent here if user selects it as a favorite
var settingsModalEl = document.getElementById("settings-modal");
var preferencesModalHeaderTextEl = document.querySelector(".modal-card-title");
var savedTasks = []; //array to hold existing tasks previously saved

// TODO: see below
// this function is called when the "settings" menu item is tapped
var showSettings = function() {

    // TODO: 
    // show the settings modal, but
    // use a different header in preferencesModalHeaderTextEl,
    // the element with id="preferences-help-text" should be hidden,
    // change the submit button text (id="settings-modal-save") to something like "Update Preferences"
    //
    // the listener at bottom of this file still calls updatePreferences() function to vet input

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

    // nice to have:
    // buy the developers a cup of coffee! <3 <3 <3
    // https://www.buymeacoffee.com/

}

// TODO: maybe: finish this
// this function will ask the user for input (name, content types, etc) if it is their first time using the app
var firstTime = function() {

    // if there is a name saved, then it's not the first time, load content and exit the function
    if (localStorage.getItem("user") !== null) {
        displayContent();
        return;
    }

    // show the settings modal with header specified for first time
    settingsModalEl.classList.add("is-active");
    preferencesModalHeaderTextEl.textContent = "Let's Get Started!";

    // TODO: (maybe) ask user to select app theme colors (optional)
    // add radio buttons to html form

    // TODO: (maybe) ask user to choose font family (optional)
    // add radio buttons to html form
}

// TODO: see below
// this function is called when the user tries to submit their info on first app visit, or when updating preferences
var updatePreferences = function(event) {

    event.preventDefault();

    user = document.getElementById("name-input").value.trim();
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
        if (hasMeme) {
            contentTypes.push("meme");
        }
        setLocalStorage();
        settingsModalEl.classList.remove("is-active");

        // TODO:
        // if this is not the first time saving settings,
        // then this probably shouldn't refresh the content unless the old content type was removed?
        // might be nothing to worry about.
        //
        // see TODO in displayContent()
        displayContent();
    }
}

// TODO: add more types, "meme", "advice"
// for memes, probably store url in "quote" and caption in "author"
// displaying a meme would be handled in displayContent (maybe by seeing if the quote ends in ".jpg")
//
// this function updates currentContent to content of type "type"
// where type = "kanye", "stoicism", "zen", "dadjoke":
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
        url = "https://icanhazdadjoke.com/";
        headers = {headers: {Accept: "application/json"}};
    }
    //TODO: handle type meme, advice

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
            currentContent.author = "Ye West";
            currentContent.quote = data.quote;
        }
        else if (type === "stoicism") {
            // if the quote is from twitter, move the @ symbol from end of quote to front of the author's twitter username
            if (data.data.quote.slice(-1) === "@") {
                currentContent.author = "@" + data.data.author;
                currentContent.quote = data.data.quote.slice(0, -1);
            }
            else {
                currentContent.author = data.data.author;
                currentContent.quote = data.data.quote;
            }
        }
        else if (type === "zen") {
            currentContent.author = data[0].a;
            currentContent.quote = data[0].q;
        }
        else if (type === "dadjoke") {
            currentContent.author = "icanhazdadjoke.com";
            currentContent.quote = data.joke;
        }
        //TODO: handle type meme, advice

        //if no author
        if (currentContent.author.trim() === "") {
            currentContent.author = "Unknown";
        }
    })
    .catch(error => {
        console.log("Unable to connect to " + type + " API:");
        console.log(error);
    });
}

// TODO: see below
// displays a currentContent
var displayContent = async function() {

    // TODO: maybe the type selection and/or setContent() should be in a separate function?

    // choose a random content type from array of user specified types
    var type = contentTypes[randomNumber(0, contentTypes.length - 1)];

    await setContent(type);

    // TODO: displaying a meme can be handled by seeing if type = "meme" before displaying)

    // display content
    document.getElementById("quotation").textContent = currentContent.quote;
    document.getElementById("author").textContent = currentContent.author;
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
    localStorage.setItem("storedTasks", JSON.stringify(savedTasks));
}

// utility function to generate a random numeric value between min and max, inclusive
var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// shows add-task modal when add-task button is clicked to have the user create a new task
var addTaskButtonHandler = function (event) {
    var addTaskModal = document.getElementById("add-task-modal");
    addTaskModal.classList.add("is-active");
    var addTaskField = document.getElementById("add-task-field"); //textarea box
    var saveChangesBtn = document.getElementById("save-added-task");
    var tasksList = document.getElementById("tasks-list");

    //cancels out of add-tasks modal 
    addTaskModal.onclick = function(event) {
        var clickedElement = event.target;
        if(clickedElement.classList.contains("is-danger")) {
            addTaskModal.classList.remove("is-active");
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
            taskInput.setAttribute("type","checkbox");           
            addTaskField.value = "";
            newTask.classList.add("has-background-info-light");

            //Save newly created task in localStorage
            var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
            if (storedTasks == null) {
                storedTasks = savedTasks;
            }
            savedTasks = storedTasks;
            savedTasks.push(taskLabel.textContent);
            setLocalStorage();

            taskLabel.appendChild(taskInput);
            newTask.appendChild(taskLabel);
            tasksList.appendChild(newTask);

            addTaskModal.classList.remove("is-active");
        }

        addTaskField.setAttribute("placeholder", "Input a peaceful task");
        
    }

}

// loads tasks the user previously created to continue where they left off
var loadTasks = function () {
        var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
        var tasksList = document.getElementById("tasks-list");

        if (storedTasks !== null) {
        for (var task = 0; task < storedTasks.length; task++) {
            var newTask = document.createElement("li");
            var taskLabel = document.createElement("label");
            var taskInput = document.createElement("input");

            newTask.classList.add("has-background-info-light");
            taskLabel.classList.add("checkbox");
            taskLabel.textContent = storedTasks[task];
            taskInput.setAttribute("type","checkbox");
            taskLabel.appendChild(taskInput);
            newTask.appendChild(taskLabel);
            tasksList.appendChild(newTask);
        }
    }
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
        else if (checkedOffTasks[task].checked === false) {
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

    for (var task = 0; task < checkedOffTasks.length; task++) {
        if (checkedOffTasks[task].checked === true) {
            var storedTasks = JSON.parse(localStorage.getItem("storedTasks"));
            var taskText = document.createElement("p");
            var taskLabel = checkedOffTasks[task].parentNode;
            for (var stored = 0; stored < storedTasks.length; stored++) {
                if (storedTasks[stored] == taskLabel.textContent) {
                    const taskIndex = storedTasks.indexOf(storedTasks[stored]);
                    storedTasks.splice(taskIndex, 1);
                    localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
                }
            }
            taskText.textContent = taskLabel.textContent;
            completedTasksPane.append(taskText);
            taskLabel.parentNode.remove();
        }
    }
    }
// switches tasks panes, which will allow either current tasks or completed tasks to appear
var switchTasksPane = function (event) {
    if (event.target.matches("span")) {
        var currentTasksBtn = document.getElementById("current-tasks-pane");
        var completedTasksBtn = document.getElementById("completed-tasks-pane");
        var currentTasks = document.getElementById("tasks-list");
        var completedTasksPane = document.getElementById("completed-tasks");
        var taskPane = event.target.parentNode.parentNode;

        if (taskPane == currentTasksBtn) {
            completedTasksBtn.classList.remove("is-active");
            completedTasksPane.style.display = "none";
            currentTasksBtn.classList.add("is-active");
            currentTasks.style.display = "flex";
        }
        else if (taskPane == completedTasksBtn) {
            currentTasksBtn.classList.remove("is-active");
            currentTasks.style.display = "none"
            completedTasksBtn.classList.add("is-active");
            completedTasksPane.style.display = "flex";
        }
    }
}

// call initial functions
$(document).ready(getLocalStorage);
$(document).ready(firstTime);

// Listeners
document.getElementById("settings").addEventListener("click", showSettings);
document.getElementById("about").addEventListener("click", showAbout);
document.getElementById("settings-modal-save").addEventListener("click", updatePreferences);
document.getElementById("add-new-task").addEventListener("click", addTaskButtonHandler);
document.getElementById("tasks-list").addEventListener("click", markTaskComplete)
document.getElementById("completed-task-btn").addEventListener("click",moveTasksToComplete);
document.getElementById("tasks-pane").addEventListener("click",switchTasksPane);
document.addEventListener("DOMContentLoaded", loadTasks);