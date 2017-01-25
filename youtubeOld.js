function hideRecommandations() {
    try{
        document.getElementById('feed').remove();
        console.log("hide <feed> successful");
    }catch(e){
        // if it doesn't have it, we don't need to hide
        console.log("hide <feed> unsuccessful");
    }
    try{
        document.getElementById('watch7-sidebar-contents').remove();
        console.log("hide <sidebar> successful");
    }catch(e){
        console.log("hide <sidebar> unsuccessful");
    }
}
// TODO override XMLHttpRequest.open
function addSingleXMLRequestCallback(callback){
    var oldSend = XMLHttpRequest.prototype.send;
    // override the native send()
    XMLHttpRequest.prototype.send = function(){
        // this object has nothing...you CANNOT get responseURL...before sent
        callback(this); // use closure
        // call the native send()
        oldSend.apply(this, arguments);
    }
}

function changeOnDomLoad(){
    document.getElementsByTagName('html')[0].style.display="none";
    document.addEventListener("DOMContentLoaded", function(){
        console.log('on DOMContentLoaded');
        hideRecommandations();
        document.getElementsByTagName('html')[0].style.display="block";
    });
}

changeOnDomLoad();

var actualCode = addSingleXMLRequestCallback + ' ' + hideRecommandations + '(' + function() {
    // immediately executed functions
    window.onpopstate = function(){ // FIXME forward/backward eventhanlder
        console.log('onpopstate');
        window.setTimeout(hideRecommandations,500);
        // TODO DOM breakpoints
        // timing does not work for youtube.com
    };

    addSingleXMLRequestCallback( function( xhr ) {
        xhr.onload = function(){
            if(xhr.responseURL.endsWith("spf=navigate")){
                console.log("xhr request url:" + xhr.responseURL);
                // this happens before document finish loading, no need to hide <html
                hideRecommandations();
            }
        }
    });
} + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.remove();

//document.onload is not fired, chrome does not support
