/* Google Public Calendar Feed Reader */
(function($) {
    /*! insert new HTML content */
    $(document).ready(function() {
        if (!$('p.gcfr-loader').length) {
            $('.gCalFeedReader').append($('<div class="gcfr-loaderWrapper"><p class="gcfr-loader">Loading<span>.</span><span>.</span><span>.</span></p></div>')).append('<div class="gcfr-allEventsWrapper"></div>');
        } else {}
        $('.gcfr-allEventsWrapper').append($('<div id="gcfr-futureEventsColumn"><div class="gcfr-eventsListWrapper"><ul id="gcfr-futureEventsList" class="gcfr-eventsList"></ul></div></div>')).append($('<div id="gcfr-pastEventsColumn"><div class="gcfr-eventsListWrapper"><ul id="gcfr-pastEventsList" class="gcfr-eventsList"></ul></div></div>'));
    })
}(jQuery));
/*! Calendar Feed Reader script */
(function($) {
    $.fn.gCalFeedReader = function(options) {
        var $div = $(this);
        /*! default options */
        var defaults = $.extend({
                startDateFormat: 'longDate+startingTime',
                endDateFormat: 'longDate+endingTime',
                errorMsg: 'the request failed',
                errorMsgLocation: 'no location to display',
                timeZone: 'America/New_York',
                maxEvents: 25,
                singleEvents: true
            },
            options);
        var s = '';
        var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
            encodeURIComponent(defaults.calendarId.trim()) + '/events?timeZone=' + encodeURIComponent(defaults.timeZone) + '&key=' + defaults.apiKey +
            '&orderBy=startTime&singleEvents=true';
        if (defaults.futureEventsOnly) {
            feedUrl += '&timeMin=' + new Date().toISOString();
        } else if (defaults.pastEventsOnly) {
            feedUrl += '&timeMax=' + new Date().toISOString();
        } else {}
        /*! perform Ajax requests */
        $.ajax({
            url: feedUrl,
            dataType: 'json',
            success: function(data) {
            if (!$($div).parent('.gcfr-eventsListWrapper').find("h2.gcfr-eventsHeader").length ){
            $($div).parent('.gcfr-eventsListWrapper').prepend('<h2 class="gcfr-eventsHeader">' + defaults.eventsHeader + '</h2>')
            }
            else {}
                if (defaults.sortDescending) {
                    data.items = data.items.reverse();
                }
                data.items = data.items.slice(0, defaults.maxEvents);
                $.each(data.items, function(e, item) {
                    var eventLink = item.htmlLink;
                    var itemEndDate = item.end.date;
                    var itemEndDateCorrected = moment(itemEndDate).subtract(1, 'seconds').format('YYYY-MM-DD');
                    var eventStartDate = item.start.dateTime || item.start.date || '';
                    var eventEndDate = item.end.dateTime || itemEndDateCorrected || '';
                    var summary = '<a target="_blank">' + '<span class="gcfr-eventLink">' + eventLink + '</span>' + item.summary + '</a>' || '';
                    var description = item.description;
                    var location = item.location;
                    var eventStart = formatDate(eventStartDate, defaults.startDateFormat.trim());
                    var eventEnd = formatDate(eventEndDate, defaults.endDateFormat.trim());
                    s = '<div class="gcfr-eventTitle">' + '<h3>' + summary + '</h3>' + '</div>';
                    if (eventEnd) {
                        s += '<div class="gcfr-eventDate">' + '<p><strong>When: </strong>' + eventStart + '<span class="gcfr-datePrep">' + ' ' + ' to ' + ' ' + '</span>' + eventEnd + '</p>' + '</div>';
                    } else {}
                    if (location) {
                        s += '<div class="gcfr-eventLocation">' + '<p><strong>Where: </strong>' + '<span class="gcfr-location">' + location + '</span>' + '</p>' + '</div>';
                    } else {
                        s += '<div class="gcfr-eventLocation">' + '<p><strong>Where: </strong>' + '<span class="gcfr-noLocation">' + defaults.errorMsgLocation + '</span>' + '</p>' + '</div>';
                    }
                    if (description) {
                        s += '<div class="gcfr-eventDescription">' + '<p><strong>Description: </strong>' + description + '</p> ' + '</div>';
                    } else {}
                    $($div).append('<li>' + s + '</li>');
                });
            },
            error: function(xhr, status) {
                $($div).append('<p class="gcfr-errorMsg">' + status + ' : ' + defaults.errorMsg + '</p>');
            }
        });
        /*! format dates */
        function formatDate(strDate, strFormat) {
            var fd, arrDate, am, time1, time2;
            var calendar = {
                months: {
                    full: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    shortened: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                days: {
                    full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    shortened: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            };
            if (strDate.length > 10) {
                arrDate = /(\d+)\-(\d+)\-(\d+)T(\d+)\:(\d+)/.exec(strDate);
                am = (arrDate[4] < 12);
                time1 = time2 = am ? (parseInt(arrDate[4]) + ':' + arrDate[5] + ' AM') : (
                    arrDate[4] - 12 + ':' + arrDate[5] + ' PM');
                if (time1.indexOf('0') === 0) {
                    if (time1.indexOf(':00') === 1) {
                        if (time1.indexOf('AM') === 5) {
                            time1 = 'MIDNIGHT';
                        } else {
                            time1 = 'NOON';
                        }
                    } else {
                        time1 = time1.replace('0:', '12:');
                    }
                }
                if (time2.indexOf('0') === 0) {
                    if (time2.indexOf(':00') === 1) {
                        if (time2.indexOf('AM') === 5) {
                            time2 = 'MIDNIGHT';
                        } else {
                            time2 = 'NOON';
                        }
                    } else {
                        time2 = time2.replace('0:', '12:');
                    }
                }
            } else {
                arrDate = /(\d+)\-(\d+)\-(\d+)/.exec(strDate);
                time1 = '<span class="gcfr-noStartTime">all day</span>';
                time2 = '<span class="gcfr-noEndTime">all day</span>';
            }
            var year = parseInt(arrDate[1]);
            var month = parseInt(arrDate[2]);
            var dayNum = parseInt(arrDate[3]);
            var d = new Date(year, month - 1, dayNum);
            switch (strFormat) {
                case 'startingTime':
                    fd = time1;
                    break;
                case 'endingTime':
                    fd = time2;
                    break;
                case 'shortDate':
                    fd = month + '/' + dayNum + '/' + year;
                    break;
                case 'longDate':
                    fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[month] + ' ' + dayNum + ', ' + year;
                    break;
                case 'longDate+startingTime':
                    fd = '<span class="gcfr-startDate">' + calendar.days.full[d.getDay()] + ' ' + calendar.months.full[month] + ' ' + dayNum + ', ' + year + '</span>' + ' ' + time1;
                    break;
                case 'longDate+endingTime':
                    fd = '<span class="gcfr-endDate">' + calendar.days.full[d.getDay()] + ' ' + calendar.months.full[month] + ' ' + dayNum + ', ' + year + '</span>' + ' ' + time2;
                    break;
                case 'shortDate+startingTime':
                    fd = '<span class="gcfr-startDate">' + month + '/' + dayNum + '/' + year + '</span>' + ' ' + time1;
                    break;
                case 'shortDate+endingTime':
                    fd = '<span class="gcfr-endDate">' + month + '/' + dayNum + '/' + year + '</span>' + ' ' + time2;
                    break;
                case 'dayMonth':
                    fd = calendar.days.shortened[d.getDay()] + ', ' + calendar.months.full[month] + ' ' + dayNum;
                    break;
                case 'monthDay':
                    fd = calendar.months.full[month] + ' ' + dayNum;
                    break;
                case 'yearMonth':
                    fd = calendar.months.full[month] + ' ' + year;
                    break;
                default:
                    fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.shortened[month] + ' ' + dayNum + ', ' + year + ' ' + time1;
            }
            return fd;
        }
    };
}(jQuery));
/*! code to be executed when all Ajax requests have completed */
(function($) {
    $(document).ajaxStop(function() {
        /*! text to display if there are no events */
        $("ul.gcfr-eventsList").each(function() {
            if ((!$(this).has("li").length) && (!$(this).has("p.gcfr-errorMsg").length)) {
                $(this).append("<p>No events to display</p>")
            } else {}
            /*! convert the title of each event into an absolute link to the event in the Google Calendar Web UI */
            $("ul.gcfr-eventsList li").each(function() {
                var eventTitleText = $(this).find(".gcfr-eventLink").text();
                $(this).find("a").attr("href", eventTitleText);
                $(this).find(".gcfr-eventLink").hide()
            })
        });
        /*! remove ongoing events from the past events list */
        var firstList = [];
        $("#gcfr-futureEventsList li").each(function() {
            firstList.push($(this).text())
        });
        $("#gcfr-pastEventsList li").filter(function() {
            return firstList.indexOf($(this).text()) > -1
        }).remove();
        /*! remove the event end date if it is similar to the event start date */
        $("ul.gcfr-eventsList li").each(function() {
            var startDate = $(this).find("span.gcfr-startDate");
            var endDate = $(this).find("span.gcfr-endDate");
            var allDayStart = $(this).find("span.gcfr-noStartTime");
            var allDayEnd = $(this).find("span.gcfr-noEndTime");
            if (startDate.text() == endDate.text()) {
                endDate.hide();
                allDayStart.closest("p").children("span.gcfr-datePrep").hide();
                allDayEnd.hide()
            } else {}
        });
        /*! find URLs in plain-text and convert them automatically into HTML links, then mask email addresses to protect them from spam bots */
        $(function() {
            var functionOne = function() {
                var r = $.Deferred();
                $("ul.gcfr-eventsList").linkify({
                    tagName: "a",
                    target: "_blank",
                    newLine: "",
                    linkClass: null,
                    linkAttributes: null
                });
                return r
            };
            var functionTwo = function() {
                $(function() {
                    var mail = $('ul.gcfr-eventsList a[href^="mailto:"]');
                    mail.each(function(index, element) {
                        $(this).mailmask({
                            placeholder: " [#] "
                        })
                    })
                })
            };
            functionOne().done(functionTwo())
        });
        /*! convert each event address into a HTML link to a Google map  */
        $(".gcfr-eventLocation span").each(function() {
            if ($(this).hasClass("gcfr-location")) {
                var b = "<a href='http://maps.google.com/maps?q=" + encodeURIComponent($(this).text()) + "' target='_blank'>" + $(this).text() + "<i class='fa fa-map-marker'></i></a>";
                $(this).html(b)
            } else {}
        });
        /*! hide loader */
        $(".gcfr-loader").hide();
        /*! remove list title if empty*/
        $('.gcfr-eventsListWrapper h2').each(function() {
            if ($(this).html() == "") {
                $(this).remove();
            }
        });
        /*! show events */
        $(".gcfr-allEventsWrapper").show();
    });
}(jQuery));
