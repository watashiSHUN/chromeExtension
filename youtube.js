document.getElementsByTagName('html')[0].style.display="none";
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("document finished loading");
    try{
        document.getElementById('watch7-sidebar-contents').style.display="none";
    }catch(e){
    }
    document.getElementsByTagName('html')[0].style.display="block";
});

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

var actualCode = addSingleXMLRequestCallback + '(' + function() {
    // immediately executed functions

    window.onpopstate = function(){ // FIXME forward/backward eventhanlder
        console.log("on page load");
        console.log(document.location); // document.location is updated
        console.log(document.getElementById('watch7-sidebar-contents')); // this is not
        try{
            document.getElementById('watch7-sidebar-contents').style.display="none";
        }catch(e){
        }
    }

    addSingleXMLRequestCallback( function( xhr ) {// TODO override history.pushstate instead of filtering XMLHttpRequests
        xhr.onload = function(){
            if(xhr.responseURL.endsWith("spf=navigate")){
                console.log(xhr.responseURL);
                // this happens before document finish loading, no need to hide <html>
                try{
                    document.getElementById('watch7-sidebar-contents').style.display="none";
                }catch(e){
                }
            }
        }
    });
} + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.remove();

//document.onload is not fired, chrome does not support
console.log("content script ran");
