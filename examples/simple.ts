#!/usr/bin/env -S node --experimental-strip-types

const getoptLong: typeof import('../src/index') = require('../lib/index.js');

const NGL = getoptLong.get;
const ngl = new NGL(
  [
    ['verbose|v+', 'verbose'],
    ['elephant|e+', 'elephants'],
  ],
  {
    subCommand: true,
  },
);
const options = ngl.process();

console.log(ngl, options, process.argv);
