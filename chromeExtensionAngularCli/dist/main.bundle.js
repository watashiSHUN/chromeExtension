webpackJsonp([1,4],{

/***/ 342:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 342;


/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(452);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=D:/chromeExtension/chromeExtensionAngularCli/src/main.js.map

/***/ }),

/***/ 451:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(136);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    // TODO delete and rename, we don't need to search for everything
    // refreshSingleBookshelf(name){
    //
    // }
    function AppComponent(ngzone, sanitizer) {
        var _this = this;
        this.animationDelay = 40; // no animation by default
        this.sanitizer = sanitizer;
        this.ngZone = ngzone;
        this.bookshelves = {};
        this.histories = [];
        this.displayHistories = [];
        this.timeOut = 0;
        if (window.localStorage.getItem("filters") == null) {
            this.filters = []; // if we put null, refresh for loop will fail
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
            var pattern = /https?:\/\/[^/]*/; // only want the hostname
            for (var _i = 0, historyItems_1 = historyItems; _i < historyItems_1.length; _i++) {
                var historyItem = historyItems_1[_i];
                var matchResults = historyItem.url.match(pattern);
                if (matchResults != null && matchResults.length == 1) {
                    // if no matches, the return value is null instead of an array
                    var rootUrl = matchResults[0];
                    if (rootUrl in dictionary) {
                        dictionary[rootUrl] = _this.updateHistories(rootUrl, dictionary[rootUrl], historyItem.visitCount);
                    }
                    else {
                        dictionary[rootUrl] = _this.updateHistories(rootUrl, _this.histories.length, historyItem.visitCount);
                    }
                }
            }
        });
    }
    AppComponent.prototype.imageURL = function (bookmark) {
        return this.sanitizer.bypassSecurityTrustUrl('chrome://favicon/size/16@1x/' + bookmark.url);
    };
    AppComponent.prototype.updateHistories = function (key, index, visitCount) {
        var _this = this;
        // each url has a visitCount
        if (index == this.histories.length) {
            // newly added items
            this.histories.push([key, visitCount]);
            this.ngZone.run(function () { return setTimeout(function () { return _this.displayHistories.push([key, visitCount]); }, _this.timeOut += _this.animationDelay); });
        }
        else {
            this.histories[index][1] += visitCount;
            this.ngZone.run(function () { return setTimeout(function () { return _this.displayHistories[index][1] += visitCount; }, _this.timeOut += _this.animationDelay); });
        }
        // pop up
        var returnV = 0;
        var _loop_1 = function(i) {
            //TODO linked list will be easier
            if (this_1.histories[i][1] >= this_1.histories[i + 1][1]) {
                returnV = i + 1;
                return "break";
            }
            else {
                var temp = this_1.histories[i];
                this_1.histories[i] = this_1.histories[i + 1];
                this_1.histories[i + 1] = temp;
                this_1.ngZone.run(function () { return setTimeout(function () {
                    var temp = _this.displayHistories[i];
                    _this.displayHistories[i] = _this.displayHistories[i + 1];
                    _this.displayHistories[i + 1] = temp;
                }, _this.timeOut += _this.animationDelay); });
            }
        };
        var this_1 = this;
        for (var i = index - 1; i >= 0; i--) {
            var state_1 = _loop_1(i);
            if (state_1 === "break") break;
        }
        // return newindex
        return returnV;
    };
    //TODO merge them into one button
    AppComponent.prototype.rename = function (bookmark) {
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
    AppComponent.prototype.delete = function (bookmark) {
        var _this = this;
        chrome.bookmarks.remove(bookmark.id, function () {
            chrome.bookmarks.getRecent(20, function (results) {
                _this.refresh();
            });
        });
    };
    AppComponent.prototype.refresh = function () {
        var _this = this;
        // TODO why immediately executed function doesn't work
        // ts => js issue
        var semaphore = 0;
        var _loop_2 = function(i) {
            console.log("search for " + "[" + this_2.filters[i] + "]");
            chrome.bookmarks.search("[" + this_2.filters[i] + "]", function (results) {
                _this.bookshelves[_this.filters[i]] = results;
                if (++semaphore == _this.filters.length) {
                    _this.ngZone.run(function () { _this.bookShelfNames = Object.keys(_this.bookshelves); });
                }
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.filters.length; i++) {
            _loop_2(i);
        }
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(608),
            styles: [__webpack_require__(607)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgZone */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/chromeExtension/chromeExtensionAngularCli/src/app.component.js.map

/***/ }),

/***/ 452:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(451);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=D:/chromeExtension/chromeExtensionAngularCli/src/app.module.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=D:/chromeExtension/chromeExtensionAngularCli/src/environment.js.map

/***/ }),

/***/ 607:
/***/ (function(module, exports) {

module.exports = ".bookmark:hover a{\r\n    display: block;\r\n}\r\n.bookmark .buttons, .bookmark a{\r\n    display:none\r\n}\r\n.bookmark{\r\n    display:-webkit-box;\r\n    display:-ms-flexbox;\r\n    display:flex;\r\n}\r\n.bookmark .title{\r\n    display:block;\r\n}\r\n.bookmark a, .bookmark .title {\r\n    white-space:pre;\r\n    overflow:hidden;\r\n    text-overflow:ellipsis;\r\n}\r\n.bookmark a{\r\n    color: hsl(0, 0%, 70%);\r\n    -ms-flex-negative:4;\r\n        flex-shrink:4;\r\n}\r\n#shortcut ul{\r\n    display:inline-block;\r\n    width:22%\r\n}\r\n"

/***/ }),

/***/ 608:
/***/ (function(module, exports) {

module.exports = "<div id=\"shortcut\">\n<ul *ngFor=\"let bookshelfName of bookShelfNames\">\n<div>[{{bookshelfName}}]</div>\n<li class=\"bookmark\" *ngFor=\"let bookmark of bookshelves[bookshelfName]\">\n        <img [src]=\"imageURL(bookmark)\" width=\"16\" height=\"16\">\r\n        <span class=\"title\">{{bookmark.title.substring(bookshelfName.length+2)}}</span>\n        <a href=\"{{bookmark.url}}\">{{bookmark.url}}</a>\n        <span class=\"buttons\">\n            <button (click)=\"delete(bookmark)\" >Delete</button>\n            <button (click)=\"rename(bookmark)\" >Rename</button>\n        </span>\n</li>\n</ul>\n</div>\n\n<ul>\n    <li *ngFor=\"let history of displayHistories\">\n        {{history[0]}} => {{history[1]}}\n    </li>\n</ul>\n"

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(343);


/***/ })

},[621]);
//# sourceMappingURL=main.bundle.map