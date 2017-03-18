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

function organize(tab){
    var queryObject = {'currentWindow':true};
    if (tab){
        var hostUrl = tab.url.match(/https?:\/\/[^/]*/); // took from the newtab extension
        if ( !hostUrl || hostUrl.length != 1){
            // for example "chrome://extensions/"
            console.log("failed to find host URL: " + tab.url);
            return // do nothing
        }
        hostUrl = hostUrl[0];

        var oldUrl = window.sessionStorage[tab.id];
        window.sessionStorage[tab.id] = tab.url; // update
        if (oldUrl && compareHost(oldUrl,hostUrl)){
            // same host, do nothing
            console.log("same host, abort");
            return;
        }
        if (!tab.active){
            // open in new tab, but I want to continue with my current session
            // still record its url changes for host detection
            console.log("no same host, noop");
            return;
        }
        // set up query parameter
        queryObject.url = hostUrl + "/*"; // https://developer.chrome.com/extensions/match_patterns
        queryObject.active = false; // currenttab, which is focused, does not move
    }

    var activeTab = tab.id; // closure

    chrome.tabs.query(queryObject, function (tabs){
        // move tabs from the same host
        var tabIds = [];
        tabs.forEach(function(item, index, array){
            tabIds.push(item.id);
        })
        tabIds.push(activeTab); // last to be moved

        if(tabIds.length == 1){
            console.log("no same host tab found, noop");
            return;
        }

        chrome.tabs.move(tabIds,{'index':-1}, function(tabs){
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
        });
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
