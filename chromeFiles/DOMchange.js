var blockPublisher = {
"WehSing":true
};

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
        var user = getPublisher();
        // if black list -> hide page
        if(blockPublisher[user]){
            hidePage();
        // else -> hide sidebar and endscreen
        }else{
            hideSideBarRecommandations();
            hideEndScreen();
        }
        return true;
    }catch(e){
        // ie, search page/a user's main page, both fail through
        console.log("hide video playing page unsuccessful");
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

function hidePage(){
    document.getElementById('page').remove();
    console.log("hide <page> successful");
}

function getPublisher(){
    return document.getElementsByClassName('yt-user-info')[0].getElementsByTagName('a')[0].innerHTML;
}

function hideEndScreen(){
    try{
        var videoPlayer = document.getElementById('movie_player');
        var config = {attributes:true}; // class = pause-mode, playing-mode, end-mode
        var observer = new MutationObserver(function(array,instance){
            logHelper(array,instance,'movie player is modified');
            try{
                var target = videoPlayer.getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0];
                target.remove();
                // var config = {attributes:true};
                // var ob = new MutationObserver(function(a,b){
                //     logHelper(a,b,'endscreen is modified');
                //     target.style.display="none"; //XXX remove() instead of using mutationobserver
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
        // adblocker create too many load exceptions, so we use log to filter our exceptions
        console.log(e);
    }

}

function logHelper(mutationsRecords, instance, logStr){
    console.group();
    console.log(logStr);
    console.log(mutationsRecords);
    console.log(instance);
    console.groupEnd();
}

function pageContentElementMonitor(a,b){
    logHelper(a,b,'content element is modified');
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
        var target = document.getElementById('content');//FIXME once we removed <page> there will be no <content> to listen to
        // create an observer instance
        var observer = new MutationObserver(pageContentElementMonitor);
        // configuration of the observer:
        // <#placeholder-player> is added/removed...doesn't work, if you navigate from 1 video to another
        var config = { attributes:true, childList: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    });
}

// initial hide
changeOnDomLoad();
