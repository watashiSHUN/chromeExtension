// FIXME these two functions...performs so many checks because
// I don't understand the callback arguments of MutationObserver
// TODO
function hideRecommandations() {
    try{
        document.getElementById('feed').remove();
        console.log("hide <feed> successful");
        return true;
    }catch(e){
        // if it doesn't have it, we don't need to hide
        console.log("hide <feed> unsuccessful");
    }
    try{
        document.getElementById('watch7-sidebar-contents').remove();
        console.log("hide <sidebar> successful");
        hideEndVideo(); // when we open youtube video directly from a link
        return true;
    }catch(e){
        console.log("hide <sidebar> unsuccessful");
    }
    return false;
}

function hideEndVideo(){
    // TODO onDOMContentLoaded does not yet have end-screen element
    try{
        console.log(document.getElementById('movie_player').getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0]);
        var videoPlayer = document.getElementById('movie_player');
        var config = {attributes:true,childList: true};
        var observer = new MutationObserver(function(array,instance){
            console.log('movie player is modified');
            logHelper(array,instance);
            try{
                var target = videoPlayer.getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0];
                var config = {attributes:true};
                var ob = new MutationObserver(function(a,b){
                    console.log('endscreen is modified changed');
                    logHelper(a,b);
                    target.style.display="none";
                })
                ob.observe(target,config);
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

function pageElementMonitor(a,b){
    console.log('page element is modified');
    logHelper(a,b);
    hideRecommandations();
}

// TODO sometimes it is triggered twice since page class attribute is changed...twice
function changeOnDomLoad(){
    document.getElementsByTagName('html')[0].style.display="none";
    document.addEventListener("DOMContentLoaded", function(){
        console.log('on DOMContentLoaded');
        hideRecommandations();
        document.getElementsByTagName('html')[0].style.display="block";
        // navigation + click on videos
        var target = document.getElementById('page');
        // create an observer instance
        var observer = new MutationObserver(pageElementMonitor);
        // configuration of the observer:
        var config = { attributes: true, childList: true, characterData: true }; //TODO only one of them need to be true
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    });
}

// initial hide
changeOnDomLoad();
