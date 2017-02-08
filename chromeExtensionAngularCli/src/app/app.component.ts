import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    bookshelves;
    bookShelfNames;
    histories;
    displayHistories;
    filters;
    ngZone;
    sanitizer;
    timeOut;
    readonly animationDelay:number = 40; // no animation by default

    imageURL(bookmark){
        return this.sanitizer.bypassSecurityTrustUrl('chrome://favicon/size/16@1x/' + bookmark.url);
    }
    
    updateHistories(key, index, visitCount){
        // each url has a visitCount
        if(index == this.histories.length){
            // newly added items
            this.histories.push([key,visitCount])
            this.ngZone.run(()=>setTimeout(()=>this.displayHistories.push([key,visitCount]),this.timeOut += this.animationDelay));
        }else{
            this.histories[index][1] += visitCount;
            this.ngZone.run(()=>setTimeout(()=>this.displayHistories[index][1] += visitCount,this.timeOut+=this.animationDelay));
        }
        // pop up
        let returnV = 0;
        for(let i=index-1; i>=0; i--){
            //TODO linked list will be easier
            if(this.histories[i][1] >= this.histories[i+1][1]){
                returnV = i+1;
                break;
            }else{
                let temp = this.histories[i];
                this.histories[i] = this.histories[i+1];
                this.histories[i+1] = temp;
                this.ngZone.run(()=>setTimeout(()=>{
                    let temp = this.displayHistories[i];
                    this.displayHistories[i] = this.displayHistories[i+1];
                    this.displayHistories[i+1] = temp;
                },this.timeOut += this.animationDelay))
            }
        }
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
        let semaphore = 0;
        for(let i = 0; i < this.filters.length; i++){
            console.log("search for " + "["+this.filters[i]+"]");
            chrome.bookmarks.search("["+this.filters[i]+"]",(results)=>{
                    this.bookshelves[this.filters[i]] = results;
                    if(++semaphore == this.filters.length){
                        this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
                    }
                });
            // chrome.bookmarks.search("["+this.filters[i]+"]",(function(i){
            //     return (results)=>{
            //         this.bookshelves[this.filters[i]] = results;
            //         this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
            //     };
            // }).bind(this,i)());
        }
    }
    // TODO delete and rename, we don't need to search for everything
    // refreshSingleBookshelf(name){
    //
    // }
    constructor(ngzone:NgZone, sanitizer:DomSanitizer){
        this.sanitizer = sanitizer;
        this.ngZone = ngzone;
        this.bookshelves = {};
        this.histories = [];
        this.displayHistories = [];
        this.timeOut = 0;
        if (window.localStorage.getItem("filters") == null){
            this.filters = []; // if we put null, refresh for loop will fail
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
            var pattern = /https?:\/\/[^/]*/; // only want the hostname
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
                }
            }
        });
    }
}
