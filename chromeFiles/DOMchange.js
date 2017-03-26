var debug = false; //TODO when debug, change it to true
function NOOP(){};
console.log = debug?console.log:NOOP;
console.group = debug? console.group:NOOP;
console.groupEnd = debug? console.groupEnd:NOOP;

function hideRecommandations() {
    try{
        document.getElementById('feed').remove(); //XXX because contentscript does not have mutationsRecords
                                                  // need to search yourself
        console.log("hide <feed> successful");
        return true;
    }catch(e){
        // if it doesn't have it, we don't need to hide
        console.log("hide <feed> unsuccessful");
    }
    try{
        document.getElementById('watch7-sidebar').remove();
        console.log("hide <sidebar> successful");
        hideEndVideo(); //TODO two cases, if can't find endscreen, use observer. Else just remove()
        return true;
    }catch(e){
        console.log("hide <sidebar> unsuccessful");
    }
    return false;
}

function hideEndVideo(){
    try{
        // console.log(document.getElementById('movie_player').getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0]);
        var videoPlayer = document.getElementById('movie_player');
        var config = {attributes:true}; // class = pause-mode, playing-mode, end-mode
        var observer = new MutationObserver(function(array,instance){
            console.log('movie player is modified');
            logHelper(array,instance);
            try{
                var target = videoPlayer.getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0];
                target.remove();
                // var config = {attributes:true};
                // var ob = new MutationObserver(function(a,b){
                //     console.log('endscreen is modified');
                //     logHelper(a,b);
                //     target.style.display="none"; //TODO remove instead of using mutationobserver
                // })
                // ob.observe(target,config);
                instance.disconnect(); // keep watching until we get a endscreen
            }catch(e){
                console.log('does not have endscreen')
                console.log(e);
            }
        })
        observer.observe(videoPlayer,config);
    }catch(e){
        console.log('does not have videoplayer');
        console.log(e); // adblocker create too many load exceptions, so we use log to filter our exceptions
    }

}

function logHelper(mutationsRecords, instance){
    console.group();
    console.log(mutationsRecords);
    console.log(instance);
    console.groupEnd();
}

function pageContentElementMonitor(a,b){
    console.log('content element is modified');
    logHelper(a,b);
    hideRecommandations();
}

function changeOnDomLoad(){
    document.getElementsByTagName('html')[0].style.display="none";
    document.addEventListener("DOMContentLoaded", function(){
        console.log('on DOMContentLoaded');
        hideRecommandations();
        document.getElementsByTagName('html')[0].style.display="block";
        // navigation + click on videos
        var target = document.getElementById('content'); //<#feed> or <#watch7-sidebar> are both in <#page> -> <#content>
        // create an observer instance
        var observer = new MutationObserver(pageContentElementMonitor);
        // configuration of the observer:
        var config = { attributes:true, childList: true }; // <#placeholder-player> is added/removed...doesn't work, if you navigate from 1 video to another
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    });
}

// initial hide
changeOnDomLoad();
