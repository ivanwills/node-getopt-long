#!/bin/env node

var NGL = require('../index.js').get;
var ngl = new NGL(
  [
    ['verbose|v+', 'verbose'],
    ['elephant|e+', 'elephants'],
  ],
  {
    subCommand: true,
  },
);
var options = ngl.process();

console.log(ngl, options, process.argv);
