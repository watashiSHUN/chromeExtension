var debug = true; // when debug, change it to true
function NOOP(){};
console.log = debug?console.log:NOOP;
console.group = debug? console.group:NOOP;
console.groupEnd = debug? console.groupEnd:NOOP;

export {console}; // TODO this is not understood by normal js
