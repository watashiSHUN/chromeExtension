///<reference path="../typings/chrome/chrome.d.ts" />
import {Component, NgZone} from 'angular2/core';

@Component({
    selector:'sp-list',
    templateUrl:'templates/list.html'
})
// TODO add input to filter time
export class ListComponent{

    bookshelves;
    bookShelfNames;
    histories;
    filters;
    ngZone;

    mouseEnter(bookmark){
        bookmark.showEdit = true;
    }
    mouseLeave(bookmark){
        bookmark.showEdit = false;
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
        for(var i = 0; i < this.filters.length; i++){
            console.log("search for " + "["+this.filters[i]+"]");
            chrome.bookmarks.search("["+this.filters[i]+"]",((i)=>{
                return (results)=>{
                    this.bookshelves[this.filters[i]] = results;
                    this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
                };
            })(i));
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
            var pattern = /.*:\/\/[^/]*/;
            for(let historyItem of historyItems){
                var matchResults = historyItem.url.match(pattern);
                if(matchResults.length == 1){
                    var rootUrl:string = matchResults[0];
                    if (rootUrl in dictionary){
                        dictionary[rootUrl] += historyItem.visitCount;
                    }else{
                        dictionary[rootUrl] = historyItem.visitCount;
                    }
                }
            }
            // insertion sort
            var decendingArray = []
            for (var key in dictionary){
                var count = dictionary[key];
                decendingArray.push([key,count])
            }
            decendingArray.sort((a,b)=>b[1]-a[1]);
            ngzone.run(()=>{
                this.histories = decendingArray;
            });
        });
    }

}
