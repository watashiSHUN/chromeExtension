var blockPublisher = new Set([
"WehSing",
"DOTA2_YYF官方频道",
"AdmiralBulldog"
]);

function hideContent() {
    // youtube main page
    try{
        hideRecommandations();
        return true;
    }catch(e){
        // if it doesn't have it, we don't need to hide
        console.log("hide main page unsuccessful");
    }

    // youtube video playing page
    try{
        hideSideBarRecommandations();
        // if try block failed at this step -> not a video playing page
        var user = getPublisher();
        // if black list -> hide player
        if(blockPublisher.has(user)){
            console.log('trying to block the publisher');
            hidePlayer();
        // else -> hide endscreen
        }else{
            unhidePlayer();
            console.log('trying to hide the endscreen');
            hideEndScreen();
        }
        return true;
    }catch(e){
        console.log("hide video playing page unsuccessful: " + e);
    }

    return false;
}

function hideRecommandations(){
    document.getElementById('feed').remove();
    console.log("hide <feed> successful");
}

function hideSideBarRecommandations(){
    document.getElementById('watch7-sidebar').remove();
    console.log("hide <sidebar> successful");
}

function unhidePlayer(){
    document.getElementById('movie_player').setAttribute('style','');
    console.log('unhide <player> successful');
}

function hidePlayer(){
    // TODO make the following two lines of code a function
    // TODO make sure it does not play automatically
    // XXX occupying space is fine, if set to display:none
    // youtube will error out: base.js:2583 Uncaught TypeError: Cannot read property 'g' of null
    // maybe because of the rendering?
    var html5Video = document.getElementsByTagName('video')[0];
    html5Video.removeAttribute('src');
    html5Video.load();

    // try{
    //     // pause video
    //     var html5Video = document.getElementsByTagName('video')[0]; // add a event listener
    //     var config = {attributes:true}; // class = pause-mode, playing-mode, end-mode
    //     var observer = new MutationObserver(function(array,instance){
    //         logHelper(array,'html5 video element is modified');
    //         console.log('try pause');
    //         html5Video.pause();
    //         var stringArray = moviePlayer.getAttribute('class').split(' ');
    //         for(var i = 0; i < stringArray.length; i++){
    //             if('paused-mode' == stringArray[i]){
    //                 // TODO still hear 1 milisec of sound
    //                 console.log('paused successful' + moviePlayer);
    //                 instance.disconnect();
    //             }
    //         }
    //     })
    //     observer.observe(html5Video,config);
    // }catch(e){
    //     console.log('does not have html5Video');
    //     console.log(e);
    // }

    // hide video controls
    var moviePlayer = document.getElementById('movie_player');
    moviePlayer.setAttribute('style','visibility:hidden')
    console.log('hide <player> successful');
}

function getPublisher(){
    return document.getElementsByClassName('yt-user-info')[0].getElementsByTagName('a')[0].innerHTML;
}

function hideEndScreen(){
    try{
        var videoPlayer = document.getElementById('movie_player');
        var config = {attributes:true}; // class = pause-mode, playing-mode, end-mode
        var observer = new MutationObserver(function(array,instance){
            logHelper(array,'movie player is modified');
            try{
                // XXX endscreen is different for each video, need to run this code everytime
                var target = videoPlayer.getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0];
                target.remove();
                console.log('hide <endscreen> successful');
                instance.disconnect(); // keep watching until we get a endscreen
            }catch(e){
                console.log('does not have endscreen')
                console.log(e);
            }
        })
        observer.observe(videoPlayer,config);
    }catch(e){
        console.log('does not have videoplayer');
        // adblocker create too many load exceptions, so we use log to filter our exceptions
        console.log(e);
    }
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
