///<reference path="../typings/chrome/chrome.d.ts" />
import {Component, NgZone} from 'angular2/core';

@Component({
    selector:'sp-list',
    templateUrl:'templates/list.html'
})
// TODO add input to filter time
export class ListComponent{
    bookmarks; // even if bookmarks is tracked, it's change still can not be detected
    histories;
    constructor(ngzone:NgZone){
        chrome.bookmarks.getRecent(20,(results)=>{
            ngzone.run(()=>{this.bookmarks = results;});
        });// get last 10 saved bookmarks
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
