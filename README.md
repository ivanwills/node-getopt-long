node-getopt-long
================

Sophisticated command line argument passer

Version
=======

This documentation refers to node-getopt-long version 0.0.1

Synopsis
========

    var getoptLong = require('node-getopt-long');
    var options = getoptLong.options([
        ['a|arg',       'Simple true argument'],
        ['b|bar+',      'Numerically increasing argument'],
        ['c|can!',      'Negatable argument (allows --no-can to set to false)'],
        ['e|ev|even',   'Sort, medium and long names'],
        ['first',       'Only long name'],
        ['i|int=i',     'Argument with an expected integer value'],
        ['f|float=d',   'Argument with an expected floating point value'],
        ['g|groups=s',  'Argument with an expected string value'],
        ['l|list=s@',   'Argument with an expected string value that can be specified multiple times'],
        ['o|object=s%', {
            description: 'Argument with an expected key=value string, with other config options',
            test: function(value, key, getoptLongObject, paramObject) {
                if (value.match(/bad thing/)) {
                    // test failures must be thrown errors
                    throw '--object must not be a bad thing!';
                }
                // return value should be returned (useful for casting to ints, doubles etc)
                return value;
            },
            on: function(value, getoptLongObject, paramObject) {
                // do something --object is ecnountered there
            }
        }]
    ], {
        name          : 'scriptname',
        commandVersion: 0.1,
        helpPrefix    : 'Appears before arguments docs',
        helpPostfix   : 'Appears an the end of the help'
    });

    // or more compactly
    var options = require('node-getopt-long').configure([...]).process();

    // or even more compactly (options runs configure and process internally)
    var options = require('node-getopt-long').options([...]);

Description
===========

*node-getopt-long* in a command line option parser inspired by perl's Getopt::Long option parser.

Exports
=======

(object) get
------------

The internal getoptLong object

(function) configure(parameters[, newOptions])
----------------------------------------------

Creates a new getoptLong object and configures it.

(function) options(parameters[, newOptions])
--------------------------------------------

Create a new getoptLong object, configures it and processes the command line options

Options
=======

Options are specified in one of two froms ['spec', 'description'] or ['sepc', { description: 'text'[, test: function() {} || , on: function () {}]}]
Every option generates an internal *getoptLongParam* object. Options specified on the command line are checked in the specified order so if any conflicts in
maes occur the first one wins.

Configuration
=============

There are a number of configuration options supported

* name - Specify the commands name (if not specified the command name is dertermined by the how node is run
* commandVersion - Specify a version number for the command (also makes --version option appear)
* helpPrefix
* helpSuffix
* ignoreCase
* bundle

