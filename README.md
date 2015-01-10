node-getopt-long
================

Sophisticated command line argument passer

Synopsis
--------

    var getoptLong = require('node-getopt-long');
    getoptLong([
        ['a|arg',      'Simple true argument'],
        ['b|bar+',     'Numerically increasing argument'],
        ['c|cant!',    'Negatable argument (allows --no-cant to set to false)'],
        ['d|digit=i',  'Argument with an expected digit value'],
        ['e|ev|even',  'Sort, medium and long names'],
        ['first',      'Only long name'],
        ['g|groups=s', 'Argument with an expected string value']
    ]).parse();
