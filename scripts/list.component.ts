///<reference path="../typings/chrome/chrome.d.ts" />
import {Component, NgZone} from 'angular2/core';

@Component({
    selector:'sp-list',
    templateUrl:'templates/list.html',
    styles:[`.bookmark:hover a{
                display: block;
            }`,
            `.bookmark .buttons, .bookmark a{
                display:none
            }`,
            `.bookmark{
                display:flex;
            }`,
            `.bookmark .title{
                display:block;
            }`,
            `.bookmark a, .bookmark .title {
                white-space:pre;
                overflow:hidden;
                text-overflow:ellipsis;
            }`,
            `.bookmark a{
                color: hsl(0, 0%, 70%);
                flex-shrink:4;
            }`,
            `#shortcut ul{
                display:inline-block;
                width:22%
            }`
        ]
})
// TODO add input to filter time
export class ListComponent{

    bookshelves;
    bookShelfNames;
    histories;
    displayHistories;
    filters;
    ngZone;
    timeOut;
    animationDelay:number = 0; // no animation by default

    updateHistories(key, index, visitCount){
        // each url has a visitCount
        if(index == this.histories.length){
            // newly added items
            setTimeout(()=>{
                this.displayHistories.push([key,visitCount]);
                this.ngZone.run(()=>{});},
                this.timeOut += this.animationDelay
            )
            this.histories.push([key,visitCount])
        }else{
            setTimeout(()=>{
                this.displayHistories[index][1] += visitCount;
                this.ngZone.run(()=>{});},
                this.timeOut += this.animationDelay
            )
            this.histories[index][1] += visitCount;
        }
        // pop up
        let returnV = 0;
        for(let i=index-1; i>=0; i--){
            //TODO linked list will be easier
            if(this.histories[i][1] >= this.histories[i+1][1]){
                returnV = i+1;
                break;
            }else{
                setTimeout(()=>{
                    let temp = this.displayHistories[i];
                    this.displayHistories[i] = this.displayHistories[i+1];
                    this.displayHistories[i+1] = temp;
                    this.ngZone.run(()=>{});},
                    this.timeOut += this.animationDelay
                )
                let temp = this.histories[i];
                this.histories[i] = this.histories[i+1];
                this.histories[i+1] = temp;
            }
        }
        //ngrun to update UI
        // return newindex
        return returnV;
    }

    //TODO merge them into one button
    rename(bookmark){
        var newName = prompt("Bookmark Name:",bookmark.title);
        if(newName != null){
            chrome.bookmarks.update(bookmark.id,{'title':newName},()=>{
                chrome.bookmarks.getRecent(20,(results)=>{
                    this.refresh();
                })
            })
        }
    }
    delete(bookmark){
        chrome.bookmarks.remove(bookmark.id,()=>{
            chrome.bookmarks.getRecent(20,(results)=>{
                this.refresh();
            })
        })
    }
    refresh(){
        // TODO why immediately executed function doesn't work
        // ts => js issue
        for(let i = 0; i < this.filters.length; i++){
            console.log("search for " + "["+this.filters[i]+"]");
            chrome.bookmarks.search("["+this.filters[i]+"]",(results)=>{
                    this.bookshelves[this.filters[i]] = results;
                    this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
                });
            // chrome.bookmarks.search("["+this.filters[i]+"]",(function(i){
            //     return (results)=>{
            //         this.bookshelves[this.filters[i]] = results;
            //         this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
            //     };
            // }).bind(this,i)());
        }
    }
    constructor(ngzone:NgZone){
        this.ngZone = ngzone;
        this.bookshelves = {};
        this.histories = [];
        this.displayHistories = [];
        this.timeOut = 0;
        if (window.localStorage.getItem("filters") == null){
            this.filters = null;
        }else{
            this.filters = window.localStorage.getItem("filters").split(" ");
        }
        this.refresh();
        // get pages visited from lastweek
        var millisecondsInOneWeek:number = 1000*60*60*24*7;
        var oneWeekAgo:number = (new Date()).getTime()-millisecondsInOneWeek;
        var searchObject = {'text':'','startTime':oneWeekAgo};
        chrome.history.search(searchObject,(historyItems)=>{
            // TODO optimization
            var dictionary = {}; // not an array
            var pattern = /.*:\/\/[^/]*/; // only want the hostname
            for(let historyItem of historyItems){
                var matchResults = historyItem.url.match(pattern);
                if(matchResults != null &&  matchResults.length == 1){
                    // if no matches, the return value is null instead of an array
                    var rootUrl:string = matchResults[0];
                    if (rootUrl in dictionary){
                        dictionary[rootUrl] = this.updateHistories(rootUrl,dictionary[rootUrl],historyItem.visitCount);
                    }else{
                        dictionary[rootUrl] = this.updateHistories(rootUrl,this.histories.length,historyItem.visitCount);
                    }
                    //this.ngZone.run(()=>{console.log(this.histories.length)});
                }
            }
        });
    }
}
