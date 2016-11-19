///<reference path="../typings/gchrome/chrome.d.ts" />
import {Component} from 'angular2/core';
import {BookmarkComponent} from './bookmark.component';

@Component({
    selector:'sp-list',
    templateUrl:'templates/list.html',
    directives:[BookmarkComponent]
})
export class ListComponent{
    bookmarks;
    constructor(){
        chrome.bookmarks.getRecent(10,function(results){
            this.bookmark = results
        })
    }
}
