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
        var observer = new MutationObserver(hideRecommandations);
        // configuration of the observer:
        var config = { attributes: true, childList: true, characterData: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    });
}

// initial hide
changeOnDomLoad();
