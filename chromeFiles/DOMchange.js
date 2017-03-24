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
        return true;
    }catch(e){
        console.log("hide <sidebar> unsuccessful");
    }
    return false;
}

function hideEndVideo(){
    try{
        var videoPlayer = document.getElementById('movie_player');
        var config = {attributes:true,childList: true};
        var observer = new MutationObserver(function(array,instance){
            console.log(array);
            try{
                var target = videoPlayer.getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0];
                console.log(target);
                var config = {attributes:true};
                var ob = new MutationObserver(function(){
                    console.log('endscreen attribute changed');
                    target.style.display="none";
                })
                ob.observe(target,config);
                // instance.disconnect();
            }catch(e){
                console.log('does not have endscreen')
                console.log(e);
            }
        })
        observer.observe(videoPlayer,config);
    }catch(e){
        console.log('does not have videoplayer');
        console.error(e);
    }

}

function pageElementMonitor(mutationrecods,instance){
    console.log('page element is modified');
    console.group();
    console.log(mutationrecods);
    console.log(instance);
    console.groupEnd();
    hideRecommandations();
}

// TODO sometimes it is triggered twice since page class attribute is changed...twice
function changeOnDomLoad(){
    document.getElementsByTagName('html')[0].style.display="none";
    document.addEventListener("DOMContentLoaded", function(){
        console.log('on DOMContentLoaded');
        hideRecommandations();
        if(document.getElementById('movie_player')){
            console.log('has movie player'); // return true
        }
        if(document.getElementById('movie_player').getElementsByClassName('html5-endscreen ytp-player-content videowall-endscreen')[0]){
            console.log('has endscreen'); // return false
        }
        hideEndVideo(); // when we open youtube video directly from a link
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
