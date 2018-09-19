// debug statements
// console.log("injected at: " + Date());
// document.onreadystatechange = function (event) {
//     console.log(event.target.readyState + " at " + Date());
//     console.log("#secondar: " + document.querySelector('div#secondary') + ", #primary: " + document.querySelector('div#primary'));
// }

// TODO reimplement block
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
function getPublisher() {
    return document.getElementsByClassName('yt-user-info')[0].getElementsByTagName('a')[0].innerHTML;
}
function theaterModeCallBack(block, video) {
    // TODO the following two function, cannot tell if they are successful
    // if there's a way to produce failure
    var sizeButton = document.getElementsByClassName("ytp-size-button")[0];
    if (sizeButton.title == "Theater mode") {
        sizeButton.click();
        throw 'trying to turn to theater mode';
    } else if (block && video.hasAttribute('src')) {
        // XXX occupying space is fine, if set to display:none
        // youtube will error out: base.js:2583 Uncaught TypeError: Cannot read property 'g' of null
        // maybe because of the rendering?
        // XXX onloadstart event does not always trigger because youtube use the same video element
        video.removeAttribute('src');
        video.load();
        throw 'trying to block the publisher';
    }
}

function moviePlayerCallback() {
    // stuff you can do when video started playing => setMoviePlayerWatcher
    // XXX endscreen is different for each video, need to run this code everytime
    // "div.ytp-endscreen-content" might not get detected since its not direct child of movie_player (subtree:false)
    var endScreen = document.querySelector("div.html5-endscreen");
    var endScreenResult = false;
    if (endScreen != null) {
        endScreen.remove();
        endScreenResult = true;
    }

    var sizeButton = document.querySelector('button.ytp-size-button');
    var sizeButtonResult = false;
    if (sizeButton != null) {
        if (sizeButton.title == "Theater mode") {
            // click button here does not work...
            sizeButton.click();
            console.log("change to theater mode successfully");
        }
        sizeButtonResult = true;
    }
    return endScreenResult && sizeButtonResult;
}

// TODO currently boolean flags are not used, maybe refactor???
function hideContent() {
    // youtube main page
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
    var mainPageResult = false;
    if (feedToRemove) {
        feedToRemove.remove();
        mainPageResult = true;
    }

    // youtube video playing page
    // var newPlayer = document.getElementById('primary');
    // var oldPlayer = document.getElementById('watch7-content');
    // var playerToExtend = oldPlayer || newPlayer;
    var oldSideBar = document.getElementById('watch7-sidebar');
    var newSideBar = document.querySelector('div#related.style-scope.ytd-watch-flexy');
    // FIXME, secondary also includes the playlist, which I want to include
    // could have mulitple id=secondary...TODO report to google?
    // repo steps
    // 1. click a channel
    // 2. click a video to play
    // 3. document.getElementById('secondary');
    var sideBarToHide = oldSideBar || newSideBar;
    var sideBarResult = false;
    var movie_player = document.getElementById("movie_player");
    if (sideBarToHide && movie_player) {
        sideBarToHide.remove();
        // movie_player is the immediate parent of endscreeen
        moviePlayerCallback();
        DOMWatcher(movie_player, { childList: true }, moviePlayerCallback, "vidoeplayer_watcher");
        sideBarResult = true;
    }

    // hide either one of them
    return mainPageResult || sideBarResult;
}

// does not unsub
function DOMWatcher(domElement, config, callback, watcherName) {
    var observer = new MutationObserver(function (array, instance) {
        // logHelper(array, watcherName + " is modified");
        callback();
    });
    observer.observe(domElement, config);
    console.log(watcherName + " attached")
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
        // initial hide
        hideContent();
        document.documentElement.style.display = "block";
        // FIXME(this is likely changed in the new youtube) 
        // this observer is singleton, whereas movie_player observer is for each page
        var target = document.querySelector('ytd-app');
        // whatever the target is, it must exist when the DOM is loaded
        console.assert(target != null);
        // XXX if you change the target in mutation observer callback, it will run +1 time 
        // which is WHY IT IS BETTER TO MONITOR ON ATTRIBUTE
        // configuration of the observer:
        // XXX childList is immediate child only
        var config = { childList: true, subtree: true };
        DOMWatcher(target, config, hideContent, 'html_watcher')
        // 1. too much event to watch (change option)
        // 2. too much event to observe (change filter)
    });
}

changeOnDomLoad();