function logAfterMove(tabs){
    console.group();
    tabs.forEach(function(item,index,array){
        console.log("move tab: " + item.id + ", url: " + item.url + ", index: " + item.index);
    })
    console.groupEnd();
}

function compareHost(Url, host){
    if(host.length > Url.length){
        return false;
    }
    for (var i = 0; i < host.length; i++){
        if (host[i] != Url[i]){
            return false;
        }
    }
    return true;
}

function organize(currentTab){
    var queryObject = {'currentWindow':true};
    if (currentTab){
        // filter
        var hostUrl = currentTab.url.match(/https?:\/\/[^/]*/); // took from the newtab extension
        // javascript, function accessibility
        if ( !hostUrl || hostUrl.length != 1){
            // for example "chrome://extensions/"
            console.log("failed to find host URL: " + currentTab.url);
            return // do nothing
        }
        hostUrl = hostUrl[0];

        var oldUrl = window.sessionStorage[currentTab.id];
        window.sessionStorage[currentTab.id] = currentTab.url; // update
        if (oldUrl && compareHost(oldUrl,hostUrl)){
            // same host, do nothing
            console.log("same host, abort");
            return;
        }
        if (!currentTab.active){
            // open in new tab, but I want to continue with my current session
            // still record its url changes for host detection
            console.log("open in new tab, noop");
            return;
        }
        // set up query parameter
        queryObject.url = hostUrl + "/*"; // https://developer.chrome.com/extensions/match_patterns
        queryObject.active = false; // currenttab, which is focused, does not move
    }

    chrome.tabs.query(queryObject, function (tabs){
        // move tabs from the same host
        var tabIds = [];
        tabs.forEach(function(item, index, array){
            tabIds.push(item.id);
        })
        tabIds.push(currentTab.id); // last to be moved

        // if(tabIds.length == 1){
        // } XXX still decide to move, if its the last one, hard to track

        function highlightCallBack(tabs){
            // could be a single tab
            if (!Array.isArray(tabs)){
                tabs = [tabs];
            }
            logAfterMove(tabs);
            // highlight them
            var end = tabs[0].index; // they all moved to the end
            // tab is an object represent the state of the tab at the time
            var start = end - tabIds.length;
            var toHighlight = [];
            for(;start < end; end --){
                toHighlight.push(end);
            }
            //XXX the first is of toHighlight is going to stay on focus
            console.log("highlight: " + toHighlight)
            chrome.tabs.highlight({tabs: toHighlight});
        }

        if(sessionStorage[currentTab.windowId+"last"] === hostUrl){
            chrome.tabs.move(currentTab.id,{'index':-1},highlightCallBack)
        }else{
            sessionStorage[currentTab.windowId+"last"] = hostUrl;
            chrome.tabs.move(tabIds,{'index':-1},highlightCallBack)
        }

    }); // move to end will execute depends on when query finishes
    // chrome.tabs.move(tab.id,{'index':-1}, logAfterMove); // added to the callback stack late, but might get executed first because of query time
}

function update(tabId, changeInfo, tab){
    // this includes creating a new tab
    // tabId: Integer
    // changeInfo: Obj
    // tab: Tab
    var url = changeInfo.url;
    // console.log(changeInfo);
    // console.log(tab);
    if (url){ // URL is not undefined
        // console.log(url);
        organize(tab);
    }
}

chrome.tabs.onUpdated.addListener(update) // change url
// created does not have url
// TODO onMove, onAttached
