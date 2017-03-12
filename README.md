# chromeExtension => override the new tab
MATURED functionalities:
* block youtube feed, you can still see them after you finish watching your videos

TODO list:
* Display most recently added bookmarks, as google default bookmarks does not have a sort, and without openning the bookmark manager...you need to navigate till the bottom of the list...this takes a while for a person like me who likes to bookmark pages and sometime never come back to it
* Display where you spend most of your time online (for now it shows how many visit to each root url you entered)
* ~~When loading your history, add animation (reording and incrementing, number changing etc)~~
* Daily quotes (external APIs)
* Dict.youdao.com get your most recently vocabulary list (from the url)
* Google.com get your keywords (from the url)
* ~~double click to rename the bookmark~~, red X mark to delete
* ~~Add tiles that filter by tag ie [antares] or filter by folder~~
* for work, you can trigger cmd and providing arguments
* ~~hover to show actual url in the new tab~~
* ~~display fav icon~~
* make the list draggable
* weekly use static history, daily use animation
* use content script to detect whether a website contains list of hyperlinks, then, allow user to add checkmarks to it or (isread), track your process (ie how to think like a computer scientist)/ merge the paragraph into a hyper link allow you to expand
* monitor youtube searches, the ones that you search multiple times can get banded
* multiple tabs, move the one you are watching to the left

DEBUG list:
* Sometimes, the most common websites won't even show up
* name is displayed according to number of letters, but uppercase will occupy more...

Developer Commands:
run `\chromeExtension>ng build -bh /dist/ -watch` (the basehref flag is a temporary workaround until angular-cli release its new build)
