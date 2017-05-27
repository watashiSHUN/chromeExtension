var blockPublisher = new Set([
"WehSing",
"DOTA2_YYF官方频道",
"AdmiralBulldog",
"电影黑匣子",
"优酷"
]);

var oldRemove = Element.prototype.remove;
Element.prototype.remove = function(){
    // XXX this.oldRemove(arguments) == this['oldRemove'], no such property
    var s1 = this.id ? '<id: ' + this.id + '>': '';
    var s2 = this.className ? '<class:' + this.className + '>': '';
    console.log('remove ' + s1 + s2 + ' successfully');
    oldRemove.apply(this,arguments);
    // this.oldRemove does not exist
}

function hideContent() {
    // youtube main page
    try{
        document.getElementById('feed').remove();
        return true;
    }catch(e){
        // if it doesn't have it, we don't need to hide
        console.log("hide main page unsuccessful: " + e);
    }

    // youtube video playing page
    try{

        // stuff you can do when video is not fully loaded

        // if try block failed at this step -> not a video playing page
        document.getElementById('watch7-sidebar').setAttribute('style','visibility:hidden');
        // XXX remove will cause the theather mode to malfunction, since youtube will try to shift it down

        // stuff you can do when video started playing => setMoviePlayerWatcher
        // TODO make this an array of functions to be executed
        callBacks = function(){
            // XXX endscreen is different for each video, need to run this code everytime
            console.log('trying to hide the endscreen');
            document.getElementById('movie_player').getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0].remove();

            // set to theater mode:
            var sizeButton = document.getElementsByClassName("ytp-size-button")[0];
            if(sizeButton.title == "Theater mode"){
                sizeButton.click();
            }
            sizeButton.disabled = true;

            var user = getPublisher();
            // if black list -> hide player
            console.log('trying to block the publisher');
            if(blockPublisher.has(user)){
                hidePlayer();
            }
        }
        SetMoviePlayerWatcher(callBacks);

        return true;
    }catch(e){
        console.log("hide video playing page unsuccessful: " + e);
    }

    return false;
}

// TODO remove one day if no more bugs are discovered
function unhidePlayer(){
    document.getElementById('movie_player').setAttribute('style','');
    console.log('unhide <player> successful');
}

function hidePlayer(){
    // XXX occupying space is fine, if set to display:none
    // youtube will error out: base.js:2583 Uncaught TypeError: Cannot read property 'g' of null
    // maybe because of the rendering?
    var html5Video = document.getElementsByTagName('video')[0];
    html5Video.removeAttribute('src');
    html5Video.load();
    // XXX onloadstart event does not always trigger because youtube use the same video element

    // TODO remove one day if no more bugs are discovered
    // hide video controls
    // var moviePlayer = document.getElementById('movie_player');
    // moviePlayer.setAttribute('style','visibility:hidden')
    console.log('hide <player> successful');
}

function getPublisher(){
    return document.getElementsByClassName('yt-user-info')[0].getElementsByTagName('a')[0].innerHTML;
}

function SetMoviePlayerWatcher(callBacks){
    var videoPlayer = document.getElementById('movie_player');
    var config = {attributes:true}; // class = pause-mode, playing-mode, end-mode
    var observer = new MutationObserver(function(array,instance){
        logHelper(array,'movie player is modified');
        try{
            callBacks();
            instance.disconnect(); // keep watching until all the step is successful
            console.log("movie player watcher detached");
        }catch(e){
            console.log(e);
        }
    });
    observer.observe(videoPlayer,config);
    console.log("movie player watcher attached");
}

function logHelper(mutationsRecords, logStr){
    console.group();
    console.log(logStr);
    console.log(mutationsRecords);
    console.groupEnd();
}

function pageContentElementMonitor(a,b){
    logHelper(a,'content element is modified');
    hideContent();
}

function changeOnDomLoad(){
    document.getElementsByTagName('html')[0].style.display="none";
    document.addEventListener("DOMContentLoaded", function(){
        console.log('on DOMContentLoaded');
        hideContent();
        document.getElementsByTagName('html')[0].style.display="block";
        // navigation + click on videos
        //<#feed> or <#watch7-sidebar> are both in <#page> -> <#content>
        // TODO rename, this observer is singleton, whereas movie_player observer is for each page
        var target = document.getElementById('content');
        // XXX if you change the target in mutation observer callback, it will run +1 time
        // create an observer instance (just a callback function)
        var observer = new MutationObserver(pageContentElementMonitor);
        // configuration of the observer:
        // <#placeholder-player> is added/removed...doesn't work, if you navigate from 1 video to another
        // XXX childList is immediate child only
        var config = { attributes:true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    });
}

// initial hide
changeOnDomLoad();
