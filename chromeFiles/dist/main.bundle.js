webpackJsonp([1,4],{

/***/ 347:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 347;


/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(457);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=D:/chromeExtension/src/main.js.map

/***/ }),

/***/ 456:
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
                    // console.log(historyItem);
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
    AppComponent.prototype.startEditing = function (mouseEvent, bookmark) {
        var inputElement = mouseEvent.srcElement;
        var originalString = inputElement.getAttribute('ng-reflect-value');
        var tag = bookmark.title.substring(0, bookmark.title.length - originalString.length);
        // define a helper function, so that it can use this element in the scope
        var finishEditing = function (keyEvent) {
            console.log(keyEvent);
            var keyCode = keyEvent.keyCode;
            if (keyCode == '13') {
                // rename the bookmark
                if (inputElement.value != originalString) {
                    // rename
                    var newName = tag + inputElement.value;
                    // make sure the default is updated, ng-reflect-value == bookmark.title
                    bookmark.title = newName; // TODO determine what's the performance impact
                    // using angular update, if high, we can ignore this...just update the size
                    chrome.bookmarks.update(bookmark.id, { 'title': newName });
                }
                // this is just registring, the event will happen a lot later
                inputElement.setAttribute("readonly", "");
                inputElement.removeEventListener("blur", ignoreEditing);
                inputElement.removeEventListener("keypress", finishEditing);
            }
        };
        var ignoreEditing = function (focusEvent) {
            console.log(focusEvent);
            inputElement.value = originalString; // restore the display text to default
            inputElement.setAttribute("readonly", "");
            inputElement.removeEventListener("blur", ignoreEditing);
            inputElement.removeEventListener("keypress", finishEditing);
        };
        inputElement.removeAttribute("readonly"); // allow editing
        inputElement.select();
        // XXX inputElement select all text area
        inputElement.addEventListener("blur", ignoreEditing);
        inputElement.addEventListener("keypress", finishEditing);
    };
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
    // TODO implement this with an icon
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(615),
            styles: [__webpack_require__(614)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgZone */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/chromeExtension/src/app.component.js.map

/***/ }),

/***/ 457:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_tabs__ = __webpack_require__(611);
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
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_tabs__["a" /* TabsModule */].forRoot()
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=D:/chromeExtension/src/app.module.js.map

/***/ }),

/***/ 458:
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
//# sourceMappingURL=D:/chromeExtension/src/environment.js.map

/***/ }),

/***/ 614:
/***/ (function(module, exports) {

module.exports = ".bookmark:hover a{\r\n    display: block;\r\n}\r\n.bookmark a{\r\n    color: hsl(0, 0%, 70%);\r\n    -ms-flex-negative:4;\r\n        flex-shrink:4;\r\n    display:none\r\n}\r\n.bookmark{\r\n    display:-webkit-box;\r\n    display:-ms-flexbox;\r\n    display:flex;\r\n}\r\n.bookmark a, .bookmark .title {\r\n    border: none;\r\n    white-space:pre;\r\n    overflow:hidden;\r\n    text-overflow:ellipsis;\r\n}\r\n"

/***/ }),

/***/ 615:
/***/ (function(module, exports) {

module.exports = "<tabset id=\"shortcut\">\n    <tab heading=\"[{{bookshelfName}}]\" *ngFor=\"let bookshelfName of bookShelfNames\" >\n        <li class=\"bookmark\" *ngFor=\"let bookmark of bookshelves[bookshelfName]\">\n            <img [src]=\"imageURL(bookmark)\" width=\"16\" height=\"16\">\r\n            <input  class=\"title\"\r\n                    (dblclick)=\"startEditing($event,bookmark)\"\r\n                    type=\"text\"\r\n                    value=\"{{bookmark.title.substring(bookshelfName.length+2)}}\"\r\n                    size=\"{{bookmark.title.length-(bookshelfName.length+2)}}\"\r\n                    readonly>\r\n            <a href=\"{{bookmark.url}}\">{{bookmark.url}}</a>\n        </li>\n    </tab>\n</tabset>\n\n<ul class = \"list-group\">\r\n    <li *ngFor=\"let history of displayHistories\" class=\"list-group-item justify-content-start\">\r\n        {{history[0]}}\r\n        <span class=\"badge badge-default badge-pill\">{{history[1]}}</span>\r\n    </li>\n</ul>\n"

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(348);


/***/ })

},[628]);
//# sourceMappingURL=main.bundle.map