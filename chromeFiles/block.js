chrome.webRequest.onBeforeRequest.addListener(
    function(details){return {cancel:true};}, // for url passed (filtered), return this object
    {urls:
        [
            "*://dotamax.com/*",
            "*://www.douyu.com/*",
            "*://www.hanfan.cc/*",
            "*://manhua.dmzj.com/*"
        ]}, // filter, only process these urls
    ["blocking"])
