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
        ['arg|a',       'Simple true argument'],
        ['bar|b+',      'Numerically increasing argument'],
        ['can|c!',      'Negatable argument (allows --no-can to set to false)'],
        ['even|ev|e',   'Sort, medium and long names'],
        ['first',       'Only long name'],
        ['int|i=i',     'Argument with an expected integer value'],
        ['float|f=d',   'Argument with an expected floating point value'],
        ['groups|g=s',  'Argument with an expected string value'],
        ['list|l=s@',   'Argument with an expected string value that can be specified multiple times'],
        ['object|o=s%', {
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
        helpPostfix   : 'Appears an the end of the help',
        defaults      : {
            arg : false,
            can : true,
            int : 25
        }
    });

    // or more compactly
    var options = require('node-getopt-long').configure([...]).process();

    // or even more compactly (options runs configure and process internally)
    var options = require('node-getopt-long').options([...]);

Description
===========

*node-getopt-long* in a command line option parser inspired by Perl's Getopt::Long option parser.

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

Options are specified in one of two forms ['spec', 'description'] or
['sepc', { description: 'text'[, test: function() {} || , on: function () {}]}]
Every option generates an internal *getoptLongParam* object. Options specified
on the command line are checked in the specified order so if any conflicts
occur the first specified one wins.

Configuration
=============

There are a number of configuration options supported

* name - Specify the commands name (if not specified the command name is dertermined by the how node is run
* commandVersion - Specify a version number for the command (also makes --version option appear)
* defaults - Object containing default values for parameters
* helpPrefix - Text to be put at the front of help message
* helpSuffix - Text to be put at the end of the help message
* ignoreCase - TODO - choose weather arguments should be case sensitive or not (default is true)
* bundle - TODO - allow bundling of short arguments (default is true)

