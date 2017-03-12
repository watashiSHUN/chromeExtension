function callBackA(activeInfo){
    // TODO newly created, we skip
    tabId = activeInfo.tabId;
    windowId = activeInfo.windowId;
    moveProperties = {index:-1};
    // alert(chrome.tabs);
    // chrome.tabs.getCurrent(function(tab){alert(tab)});
    // prove that we have access to chrome.tabs
    chrome.tabs.move(tabId,moveProperties);
    //alert("activetab changed, tabId: " + tabId + " windowId: " + windowId );
}

function arrayToString(arr){
    var str = "";
    for(var i = 0; i < arr.length; i++){
        str = str + " " + arr[i];
    }
    return str;
}
function callBackB(highlightInfo){
    tabIds = highlightInfo.tabIds;
    windowId = highlightInfo.windowId;

    alert("highlighttab changed, tabId: " + arrayToString(tabIds) + " windowId: " + windowId );
}

chrome.tabs.onActivated.addListener(callBackA)
// chrome.tabs.onHighlighted.addListener(callBackB) // select mutliple tabs at once
