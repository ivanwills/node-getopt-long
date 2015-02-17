node-getopt-long
================

Sophisticated command line argument passer

Synopsis
--------

    var getoptLong = require('node-getopt-long');
    var options = getoptLong.configure([
        ['a|arg',      'Simple true argument'],
        ['b|bar+',     'Numerically increasing argument'],
        ['c|cant!',    'Negatable argument (allows --no-cant to set to false)'],
        ['d|digit=i',  'Argument with an expected digit value'],
        ['e|ev|even',  'Sort, medium and long names'],
        ['first',      'Only long name'],
        ['g|groups=s', 'Argument with an expected string value']
    ]).process();

    // or more compactly
    var options = require('node-getopt-long').configure([...]).process();

    // or even more compactly (options runs configure and process internally)
    var options = require('node-getopt-long').options([...]);

Description
-----------

*node-getopt-long* in a command line option parser inspired by perl's Getopt::Long option parser
