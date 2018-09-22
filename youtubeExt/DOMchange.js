// debug statements
console.log("injected at: " + Date());
// document.onreadystatechange = function (event) {
//     console.log(event.target.readyState + " at " + Date());
//     console.log("#secondar: " + document.querySelector('div#secondary') + ", #primary: " + document.querySelector('div#primary'));
// }

// TODO reimplement block
function getPublisher() {
    return document.getElementsByClassName('yt-user-info')[0].getElementsByTagName('a')[0].innerHTML;
}
var blockPublisher = new Set([
    "WehSing",
    "DOTA2_YYF官方频道",
    "AdmiralBulldog",
    "电影黑匣子",
    "优酷"
]);

// remove also does logging
var oldRemove = Element.prototype.remove;
Element.prototype.remove = function () {
    // XXX this.oldRemove(arguments) == this['oldRemove'], no such property
    var s0 = this.tagName ? '<tag:' + this.tagName + '>' : '';
    var s1 = this.id ? '<id: ' + this.id + '>' : '';
    var s2 = this.className ? '<class:' + this.className + '>' : '';
    console.log('remove ' + s0 + "," + s1 + "," + s2 + ' successfully');
    oldRemove.apply(this, arguments);
    // this.oldRemove does not exist
}

// movie_player is the immediate parent of endscreeen
function moviePlayerCallback() {
    // XXX it seems that youtube insert endscreen to the same movie_player for different videos
    // "div.ytp-endscreen-content" might not get detected since its not direct child of movie_player (subtree:false)
    var endScreen = document.querySelector("div.html5-endscreen");
    if (endScreen != null) {
        endScreen.remove();
    }

    // TODO(shun) you cannot change to default when caption is on
    // turn on theater mode by default
    var sizeButton = document.querySelector('button.ytp-size-button');
    if (sizeButton != null) {
        if (sizeButton.title == "Theater mode") {
            sizeButton.click();
            console.log("change to theater mode successfully");
        }
    }
}

var moviePlayerGlob = null; // this is the movie player we are currently observing
var moviePlayerObserverGlob = null; // TODO(shun) these two in the same class

function hideContent() {
    // youtube main page
    var iswatchpage = document.querySelector('ytd-app').getAttribute('is-watch-page');
    // the other value is "", which in JS !"" == !null == true
    if (iswatchpage == null) {
        var oldFeed = document.getElementById('feed');
        var newFeed = null;
        var various = document.querySelectorAll('ytd-browse.style-scope.ytd-page-manager');
        various.forEach(function (element) {
            // we don't want to rule out page-subtype == "channels"
            if (element.getAttribute('page-subtype') == "home") {
                newFeed = element;
            }
        })
        var feedToRemove = oldFeed || newFeed;
        if (feedToRemove) {
            feedToRemove.remove();
        }
        // main page also has "movie_player", but we don't want to monitor it
    } else {
        // youtube video playing page
        // var newPlayer = document.getElementById('primary');
        // var oldPlayer = document.getElementById('watch7-content');
        // var playerToExtend = oldPlayer || newPlayer;
        var oldSideBar = document.getElementById('watch7-sidebar');
        var newSideBar = document.querySelector('div#related.style-scope.ytd-watch-flexy');
        // "#secondary" also includes the playlist, which I want to include
        // also if "#secondary" is removed, default video view will be pretty ugly

        // could have mulitple id=secondary...TODO report to google?
        // repo steps
        // 1. click a channel
        // 2. click a video to play
        // 3. document.querySelectorAll('#secondary');
        var sideBarToHide = oldSideBar || newSideBar;
        if (sideBarToHide) {
            sideBarToHide.remove();
        }

        // when going from watch pages to watch pages, movie_player stays the same
        // but if jumped to a channel(not through subs), a new movie player is later introduced
        var movie_player = document.getElementById("movie_player");
        if (movie_player != moviePlayerGlob) {
            console.log("old: " + moviePlayerGlob + ", new: " + movie_player);
            moviePlayerGlob = movie_player;
            // pause old moviePlayer observer, if its the first time, there will be nothing to pause
            if (moviePlayerObserverGlob != null) {
                moviePlayerObserverGlob.disconnect();
                moviePlayerObserverGlob = null; // reset
                console.log("old movie_player watcher detached");
            }
            // movie_player is removed from page, we don't need to add observer
            if (moviePlayerGlob != null) {
                // initial hide, in case things are ready at this stage
                moviePlayerCallback();
                moviePlayerObserverGlob = DOMWatcherWithLog(movie_player, { childList: true }, moviePlayerCallback, "new movie_player watcher");
            }
        }
    }
}

function DOMWatcherWithLog(domElement, config, callback, watcherName) {
    var observer = new MutationObserver(function (mutationList, observer) {
        // logHelper(mutationList, watcherName + " is modified");
        callback(mutationList, observer);
    });
    observer.observe(domElement, config);
    console.log(watcherName + " attached")
    return observer;
}

function logHelper(mutationsRecords, logStr) {
    console.group();
    console.log(logStr);
    console.log(mutationsRecords);
    console.groupEnd();
}

function changeOnDomLoad() {
    document.documentElement.style.display = "none";
    document.addEventListener("DOMContentLoaded", function () {
        console.log('on DOMContentLoaded');
        // initial hide, in case things are ready at this stage
        hideContent();
        document.documentElement.style.display = "block";
        var target = document.querySelector('ytd-app');
        // whatever the target is, it must exist when the DOM is loaded
        console.assert(target != null);
        // XXX if you change the target in mutation observer callback, the callback will get called +1 time
        // which is WHY IT IS BETTER TO MONITOR ON ATTRIBUTE
        // HOWEVER when ytd-app changed attribute to is-watch-page, video player might not be loaded
        var config = { childList: true, subtree: true };
        DOMWatcherWithLog(target, config, hideContent, 'html_watcher')
        // 1. too much event to watch (change option)
        // 2. too much event to observe (change filter)
    });
}

changeOnDomLoad();