function arrayToString(arr){
    var str = "";
    for(var i = 0; i < arr.length; i++){
        str = str + " " + arr[i];
    }
    return str;
}

function objectToString(obj){
    var str = "";
    for (var propName in obj){
        str = str + " " + propName + ":" + obj[propName];
    }
    return str;
}

function callBackA(activeInfo){
    var tabId = activeInfo.tabId;
    setTimeout(function(){chrome.tabs.move(tabId,{index:-1},function(tab){console.log(tab)});},60);
    // band aid fix, if no timeout, and the mouse it over the tab
    // here's the error message:
    // tabs.move: Tabs cannot be edited right now (user may be dragging a tab).
}

chrome.tabs.onActivated.addListener(callBackA)
// FIXME when a tab is closed, the next tab is activated, thus move to the front, not what I wanted
