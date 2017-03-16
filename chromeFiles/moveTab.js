function reorder(tabs){
    // sort based on url
    tabs.sort(function(a,b){
        if(a.url < b.url){
            return -1;
        }
        if(a.url > b.url){
            return 1;
        }
        return 0;
    })
    // forEach instead of foreach
    tabs.forEach(function(item,index,array){
        chrome.tabs.move(item.id,{'index':index})
    })
}

function logAfterMove(tabs){
    if (Array.isArray(tabs)) {
        tabs.forEach(function(item,index,array){
            console.log("-->move tab: " + item.id + ", url: " + item.url);
        })
    } else{
        console.log("move tab: " + tabs.id + ", url: " + tabs.url);
    }
}

function organize(tab){
    var queryObject = {'currentWindow':true}; // by default organize the entire window
    if (tab !== null){
        var hostUrl = tab.url.match(/https?:\/\/[^/]*/); // took from the newtab extension
        if (hostUrl ===null || hostUrl.length != 1){
            // for example "chrome://extensions/"
            console.log("failed to find host URL: " + tab.url);
            return // do nothing
        }
        hostUrl = hostUrl[0] + "/*"; // https://developer.chrome.com/extensions/match_patterns
        queryObject.url = hostUrl;
        queryObject.active = false; // currenttab, which is focused, does not move
    }

    var activeTab = tab.id; // closure

    chrome.tabs.query(queryObject, function (tabs){
        // move tabs from the same host
        var tabIds = [];
        tabs.forEach(function(item, index, array){
            tabIds.push(item.id);
        })
        if(tabIds.length != 0){
            // activeTab is not the only one from this host
            chrome.tabs.move(tabIds,{'index':-1}, logAfterMove);
        }
        chrome.tabs.move(activeTab,{'index':-1}, logAfterMove);
    }); // move to end will execute depends on when query finishes
    // chrome.tabs.move(tab.id,{'index':-1}, logAfterMove); // added to the callback stack late, but might get executed first because of query time
}

function update(tabId, changeInfo, tab){
    // this includes creating a new tab
    // tabId: Integer
    // changeInfo: Obj
    // tab: Tab
    var url = changeInfo.url;
    if (url !== undefined){
        console.log(url)
        organize(tab);
    }
    // TODO, FIXME get the old url, only perform reorder if host has changed
    // the idea is that if you are reading a page, nothing happens, but if you are changing host
    // we prompt it to the last, so hopefully it will prevent you from open a lot of tabs of common host
}

chrome.tabs.onUpdated.addListener(update) // change url
// created does not have url
// TODO onMove, onAttached
