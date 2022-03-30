# Mental Health Buddy

Send yourself gentle mental health reminders and messages using Mental Health Buddy! Choose the frequency of reminders, when you would like to be notified, the type of reminder (quote vs custom) and more!

Access the deployed webapp at [https://chardmuffin.github.io/mental-health-buddy/](https://chardmuffin.github.io/mental-health-buddy/)

# User Story
```
AS A stressed out person
I WANT to have gentle mental health reminders
SO THAT I can better my wellbeing more efficiently

WHEN I open the application
THEN I see a positive greeting message and icon, and a list of my reminders
WHEN I tap the "+" icon,
THEN I am brought to a "Create New Reminder" modal where I can create a new reminder notification with various attributes (* = required): reminder to be sent at random times vs scheduled*, frequency of reminders*, description, title*, specific days vs daily. (MAYBE)If the reminder is not custom, user can choose from various types of quotes (stoicism quotes, zen quotes, inspirational quotes, humor, memes, etc.) (MAYBE) type of notification (alarm, push notification, etc).
WHEN I save a reminder
THEN I will receive a personalized notification at the specified time
WHEN I scroll down my home page
THEN I see a random inspirational quote in the footer generated from a quotes API
```

Possible APIS:
* AdviceSlip - generate random pieces of advice - https://api.adviceslip.com/
* Forismatic - generate random inspirational quotes - http://forismatic.com/en/api/
* Stoicism quotes - quotes about stoicism - https://github.com/tlcheah2/stoic-quote-lambda-public-api
* Zen Quotes - generates zen/philosophy quotes - https://zenquotes.io/


# Resources

* Hamburger Menu inspiration from #6 in: https://alvarotrigo.com/blog/hamburger-menu-css/
