///<reference path="../typings/chrome/chrome.d.ts" />
import {Component, NgZone} from 'angular2/core';

@Component({
    selector:'sp-list',
    templateUrl:'templates/list.html'
})
export class ListComponent{
    bookmarks; // even if bookmarks is tracked, it's change still can not be detected
    constructor(ngzone:NgZone){
        chrome.bookmarks.getRecent(10,(results)=>{
            ngzone.run(()=>{this.bookmarks = results;});
        })
    }

}
