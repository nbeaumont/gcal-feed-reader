#### nbeaumont.github.io

http://www.nicolasbeaumont.com/engraving/blog/?page_id=471

# Google Public Calendar Feed Reader

A jQuery plugin to format and display public Google calendar feeds as a list of events on a webpage, using the [Google Calendar API V3](https://developers.google.com/google-apps/calendar/?hl=en).

It is based on bradoyler's [GoogleCalReader-jquery-plugin](https://github.com/bradoyler/GoogleCalReader-jquery-plugin).

## Features

*   Displays a list of upcoming events in a descending order, and a list of past events in an ascending order.
*   Supports single and recurring events, events spanned over several days, and all day events.
*   Converts automatically the title of each event into an absolute link to the event in the Google Calendar Web UI.
*   Converts automatically URLs in plain-text into HTML links, and masks email addresses to protect them from spam bots.
*   Converts automatically each event address into a HTML link to a Google map.
*   Is fully customizable with CSS.

## [Demo](http://htmlpreview.github.io/?https://rawgit.com/nbeaumont/gcal-feed-reader/master/index.html)

## Dependencies

*   [Font Awesome](https://fortawesome.github.io/Font-Awesome/), an iconic font and CSS tookit.
*   [moment.js](https://github.com/moment/moment/), a JavaScript date library for parsing, validating, manipulating, and formatting dates.
*   SoapBox's [linkifyjs](https://github.com/SoapBox/linkifyjs), a jQuery plugin for finding URLs in plain-text and converting them to HTML links.
*   [mailmask](https://libraries.io/bower/mailmask), a jQuery plugin to mask email links on your site and protect them from spam bots.

## Installation

Include the following HTML code into the head section of your document.

```html

<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="styles/gcal-feed-reader.css" rel="stylesheet" type="text/css" media="all">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> 
<script type="text/javascript" src="scripts/moment.js"></script> 
<script type="text/javascript" src="scripts/jquery.linkify.js"></script> 
<script type="text/javascript" src="scripts/mailmask.js"></script> 
<script type="text/javascript" src="scripts/jquery.gcal-feed-reader.js"></script> 

```

To initialize the plugin, insert the following JavaScript code just before the body closing tag.

```javascript

jQuery(function() {
    /*! Settings for the future events list (will overwrite the default settings) */
    $("#gcfr-futureEventsList").gCalFeedReader({
        apiKey: 'AIzaSyDCgE5k8RmNM4uvX1j9vsZCjremXVhM83Y', // replace with your own Google API key
        calendarId: "4dj3qghfgp23sjhe12c2b3505s@group.calendar.google.com", // replace with your own Google public calendar ID
        futureEventsOnly: true,
        sortDescending: false,
        eventsHeader: 'Upcoming Events'
    });
    /*! Settings for the past events list (will overwrite the default settings)*/
    $("#gcfr-pastEventsList").gCalFeedReader({
        apiKey: 'AIzaSyDCgE5k8RmNM4uvX1j9vsZCjremXVhM83Y', // replace with your own Google API key
        calendarId: "4dj3qghfgp23sjhe12c2b3505s@group.calendar.google.com", // replace with your own Google public calendar ID
        pastEventsOnly: true,
        sortDescending: true,
        eventsHeader: 'Past Events'
    });
});

```

Include the following HTML code into the body of your document.

```html

<div class="gCalFeedReader"></div>

```

Replace the apiKey option with your own Google API key. You can get a Google api key by navigating to the [Google Developpers Console](https://console.developers.google.com/).

Replace the calendarId option with your own Google public calendar id.

Make sure you Google calendar is public.

Infos about creating and managing a public Google calendar can be found [here](https://support.google.com/calendar/answer/37083?hl=en).

## Options

<table width="100%" border="1" cellpadding="8" cellspacing="4">

<tbody>

<tr>

<th scope="col">Name</th>

<th scope="col">Type</th>

<th scope="col">Description</th>

<th scope="col">Default Value</th>

</tr>

<tr>

<td>apiKey</td>

<td>string</td>

<td>Option that lets you enter your Google Calendar API key.</td>

<td>undefined</td>

</tr>

<tr>

<td>calendarId</td>

<td>string</td>

<td>Option that lets you enter the ID of the Google Calendar whose events will be displayed.</td>

<td>undefined</td>

</tr>

<tr>

<td>futureEventsOnly</td>

<td>boolean</td>

<td>Option that determines whether or not only future events should be displayed. If set to false past and future events from the calendar will be displayed. If set to true only future events will be.</td>

<td>undefined</td>

</tr>

<tr>

<td>pastEventsOnly</td>

<td>boolean</td>

<td>Option that determines whether or not only past events should be displayed. If set to false past and future events from the calendar will be displayed. If set to true only past events will be.</td>

<td>undefined</td>

</tr>

<tr>

<td>eventsHeader</td>

<td>string</td>

<td>Option that lets you specify a text header for the list of events to be displayed.</td>

<td>undefined</td>

</tr>

<tr>

<td>errorMsg</td>

<td>string</td>

<td>Option that lets you specify an error message if the Ajax request fails.</td>

<td>the request failed</td>

</tr>

<tr>

<td>errorMsgLocation</td>

<td>string</td>

<td>Option that lets you specify a text message to be displayed if an event location hasn't been defined in Google calendar.</td>

<td>no location to display</td>

</tr>

<tr>

<td>startDateFormat</td>

<td>selector</td>

<td>A selector which identifies the format to use for displaying the events starting dates and times.  
The selector longDate+startingTime displays the day of the Week (Sunday Monday ... Friday Saturday), the Month (January February ... November December), the Day of the Month (1 2 ... 30 31), the year (1970 1971 ... 2029 2030), and the time (H:MM AM PM). An example of a date and a time displayed using this format will look like "Sunday November 8, 2015 8:30 PM".  
The selector shortDate+startingTime displays the Month as a number (1 2 ... 11 12), the Day of the Month (1 2 ... 30 31), the year (1970 1971 ... 2029 2030), and the time (H:MM AM PM). An example of a date and a time displayed using this format will look like: "11/8/2015 8:30 PM".  
</td>

<td>longDate+startingTime</td>

</tr>

<tr>

<td>endDateFormat</td>

<td>selector</td>

<td>A selector which identifies the format to use for displaying the events ending dates and times.  
The selector longDate+endingTime uses the same format as longDate+startingTime.  
The selector shortDate+endingTime uses the same format as shortDate+startingTime.  
</td>

<td>longDate+endingTime</td>

</tr>

<tr>

<td>timeZone</td>

<td>string</td>

<td>Option that lets you set the time zone used in the response, formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".</td>

<td>America/New_York</td>

</tr>

<tr>

<td>maxEvents</td>

<td>integer</td>

<td>The maximum number of events to display.</td>

<td>25</td>

</tr>

<tr>

<td>singleEvents</td>

<td>boolean</td>

<td>Option that determines whether or not to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves.</td>

<td>true</td>

</tr>

</tbody>

</table>

For more infos, check the [Google Calendar API](https://developers.google.com/google-apps/calendar/?hl=en) documentation.

