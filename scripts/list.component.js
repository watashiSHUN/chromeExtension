System.register(["angular2/core"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, ListComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            // TODO add input to filter time
            ListComponent = (function () {
                function ListComponent(ngzone) {
                    var _this = this;
                    this.ngZone = ngzone;
                    this.bookshelves = {};
                    if (window.localStorage.getItem("filters") == null) {
                        this.filters = null;
                    }
                    else {
                        this.filters = window.localStorage.getItem("filters").split(" ");
                    }
                    this.refresh();
                    // get pages visited from lastweek
                    var millisecondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
                    var oneWeekAgo = (new Date()).getTime() - millisecondsInOneWeek;
                    var searchObject = { 'text': '', 'startTime': oneWeekAgo };
                    chrome.history.search(searchObject, function (historyItems) {
                        // TODO optimization
                        var dictionary = {}; // not an array
                        var pattern = /.*:\/\/[^/]*/; // only want the hostname
                        for (var _i = 0, historyItems_1 = historyItems; _i < historyItems_1.length; _i++) {
                            var historyItem = historyItems_1[_i];
                            var matchResults = historyItem.url.match(pattern);
                            if (matchResults != null && matchResults.length == 1) {
                                // if no matches, the return value is null instead of an array
                                var rootUrl = matchResults[0];
                                if (rootUrl in dictionary) {
                                    dictionary[rootUrl] += historyItem.visitCount;
                                }
                                else {
                                    dictionary[rootUrl] = historyItem.visitCount;
                                }
                            }
                        }
                        // insertion sort
                        var decendingArray = [];
                        for (var key in dictionary) {
                            var count = dictionary[key];
                            decendingArray.push([key, count]);
                        }
                        decendingArray.sort(function (a, b) { return b[1] - a[1]; });
                        ngzone.run(function () {
                            _this.histories = decendingArray;
                        });
                    });
                }
                //TODO merge them into one button
                ListComponent.prototype.rename = function (bookmark) {
                    var _this = this;
                    var newName = prompt("Bookmark Name:", bookmark.title);
                    if (newName != null) {
                        chrome.bookmarks.update(bookmark.id, { 'title': newName }, function () {
                            chrome.bookmarks.getRecent(20, function (results) {
                                _this.refresh();
                            });
                        });
                    }
                };
                ListComponent.prototype.delete = function (bookmark) {
                    var _this = this;
                    chrome.bookmarks.remove(bookmark.id, function () {
                        chrome.bookmarks.getRecent(20, function (results) {
                            _this.refresh();
                        });
                    });
                };
                ListComponent.prototype.refresh = function () {
                    var _this = this;
                    var _loop_1 = function (i) {
                        console.log("search for " + "[" + this_1.filters[i] + "]");
                        chrome.bookmarks.search("[" + this_1.filters[i] + "]", function (results) {
                            _this.bookshelves[_this.filters[i]] = results;
                            _this.ngZone.run(function () { _this.bookShelfNames = Object.keys(_this.bookshelves); });
                        });
                        // chrome.bookmarks.search("["+this.filters[i]+"]",(function(i){
                        //     return (results)=>{
                        //         this.bookshelves[this.filters[i]] = results;
                        //         this.ngZone.run(()=>{this.bookShelfNames = Object.keys(this.bookshelves);});
                        //     };
                        // }).bind(this,i)());
                    };
                    var this_1 = this;
                    // TODO why immediately executed function doesn't work
                    // ts => js issue
                    for (var i = 0; i < this.filters.length; i++) {
                        _loop_1(i);
                    }
                };
                return ListComponent;
            }());
            ListComponent = __decorate([
                core_1.Component({
                    selector: 'sp-list',
                    templateUrl: 'templates/list.html',
                    styles: [".bookmark:hover a{\n                display: block;\n            }",
                        ".bookmark .buttons, .bookmark a{\n                display:none\n            }",
                        ".bookmark{\n                display:flex;\n            }",
                        ".bookmark .title{\n                display:block;\n            }",
                        ".bookmark a, .bookmark .title {\n                white-space:pre;\n                overflow:hidden;\n                text-overflow:ellipsis;\n            }",
                        ".bookmark a{\n                color: hsl(0, 0%, 70%);\n            }",
                        "#shortcut ul{\n                display:inline-block;\n                width:20%\n            }"
                    ]
                }),
                __metadata("design:paramtypes", [core_1.NgZone])
            ], ListComponent);
            exports_1("ListComponent", ListComponent);
        }
    };
});
//# sourceMappingURL=list.component.js.map