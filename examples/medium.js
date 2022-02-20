#!/usr/bin/env node

const ngl = require('../lib/getopt-long');

const options = ngl.options(
  [
    ['cacheDir|c=s', 'The directory to store the crawled data from'],
    ['har|h!', 'Output har files with other data'],
    ['headless|H!', 'Turn on (or off) headless mode'],
    ['maxErrors|max-errors|m=i', 'Maximum number of errors before stopping'],
    ['pause|p=s', 'Time in seconds to pause between each page'],
    [
      'retryErrors|retry-errors|r!',
      'Retry pages with past errors (Default is to not retry)',
    ],
    ['urls|u=s', 'File containing urls'],
    ['verbose|v+', 'Verbose output'],
  ],
  {
    name: '..',
    defaults: {
      cacheDir: './tmp',
      headless: false,
      maxErrors: 10,
      pause: 2,
      retryErrors: false,
    },
  }
);

console.log('Options set:', options);
