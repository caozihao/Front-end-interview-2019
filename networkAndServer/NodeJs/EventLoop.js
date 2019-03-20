// event-loop-1.js
setTimeout(() => {
  console.log('setTimeout 1');
}, 0);
setImmediate(() => {
  console.log('setImmediate 1');
});


// event-loop-2.js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout 2');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate 2');
  });
});

