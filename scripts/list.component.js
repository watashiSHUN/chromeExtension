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
                    chrome.bookmarks.getRecent(20, function (results) {
                        ngzone.run(function () { _this.bookmarks = results; });
                    }); // get last 10 saved bookmarks
                    // get pages visited from lastweek
                    var millisecondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
                    var oneWeekAgo = (new Date()).getTime() - millisecondsInOneWeek;
                    var searchObject = { 'text': '', 'startTime': oneWeekAgo };
                    chrome.history.search(searchObject, function (historyItems) {
                        // TODO optimization
                        var dictionary = {}; // not an array
                        var pattern = /.*:\/\/[^/]*/;
                        for (var _i = 0, historyItems_1 = historyItems; _i < historyItems_1.length; _i++) {
                            var historyItem = historyItems_1[_i];
                            var matchResults = historyItem.url.match(pattern);
                            if (matchResults.length == 1) {
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
                return ListComponent;
            }());
            ListComponent = __decorate([
                core_1.Component({
                    selector: 'sp-list',
                    templateUrl: 'templates/list.html'
                }),
                __metadata("design:paramtypes", [core_1.NgZone])
            ], ListComponent);
            exports_1("ListComponent", ListComponent);
        }
    };
});
//# sourceMappingURL=list.component.js.map