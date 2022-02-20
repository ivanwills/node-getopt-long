#!/bin/env node

var NGL = require('./lib/getopt-long.js').get;
var ngl = new NGL([
    ['verbose|v+', 'verbose'],
    ['elephant|e+', 'elephants'],
],
{
    subCommand: true
});
console.log('pre-process');
var options = ngl.process();
console.log('post-process');

console.log(ngl, options, process.argv);
