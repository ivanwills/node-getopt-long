[![Build Status](https://travis-ci.org/ivanwills/node-getopt-long.svg?branch=master)](https://travis-ci.org/ivanwills/node-getopt-long?branch=master)
[![Coverage Status](https://coveralls.io/repos/ivanwills/node-getopt-long/badge.svg?branch=master)](https://coveralls.io/r/ivanwills/node-getopt-long?branch=master)
[![Dependency Status](https://david-dm.org/ivanwills/node-getopt-long.svg)](https://david-dm.org/ivanwills/node-getopt-long.svg)
[![Code Quality](https://www.codacy.com/project/badge/23cf2066e4654fdba5e6d50f1f729268)](https://www.codacy.com/app/ivan-wills/node-getopt-long)

node-getopt-long
================

Sophisticated command line argument passer

Version
=======

This documentation refers to node-getopt-long version 0.1.2

Synopsis
========

Quick examples:

```js
    var options = require('node-getopt-long').options([
      ['flag|g', 'Flag for something'],
      ['
    ]);
```

Full detailed example:

```js
    var options = require('node-getopt-long').options([
        ['arg|a',       'Simple true argument'],
        ['bar|b+',      'Numerically increasing argument'],
        ['foo|f++',     'Numerically argument (eg can use -f 123 or -123)'],
        ['can|c!',      'Negatable argument (allows --no-can to set to false)'],
        ['even|ev|e',   'Short, medium and long names'],
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
        }],
        ['fixed|F=s', {
            description: 'This argument has a fixed set of values it can take',
            test       : ['yes', 'auto', 'no']
        }]
    ], {
        name          : 'scriptname',
        commandVersion: 0.1,
        helpPrefix    : 'Appears before arguments docs',
        helpSuffix    : 'Appears an the end of the help',
        defaults      : {
            arg : false,
            can : true,
            int : 25
        }
    });

    // or more verbosely
    var getoptLong = require('node-getopt-long');

    // get the configured getoptLong object
    var getopt = getoptLong.configure([...], {...});

    // Then process the arguments.
    var options = getopt.process();

    // use a passed parameter value
    console.log('arg = ' + options.arg);
```

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

### The Spec

First the names, a pipe delimited list of names

eg

    name|longer-name|n

The first name becomes the key to the returned options Object eg options.name

Then comes '!', '+', '++' or '='

* ! - negate - allows the user to specify they don't want that option (eg --no-name)
This sets the value for that object to false
* + - increment - Allows the value to be incremented by specifying the option
multiple times. E.g. for 'verbose|v+'

    cmd -vvv

would set option.verbose to 3.
* ++ - Numerical arguments this allows for short hand numerical arguments eg if
the spec is 'foo|f++' then you can use "-5" on the command line to mean "--foo 5".
This should be done on only one argument, two or more use it the first argument
will win.
* = - assign a value - Allows the user to passing a value with a type n = integer,
s = string and f = float. E.g.
** string|s=s - requires a string value
** integer|i=i - requires an integer value
** float|f=f - requires a floating point number

Value parameters can also be Array or Object values, Array values can be
specified multiple times and object values are specified as key=value
pairs. Eg

* array|a=s@ - would allow 'cmd -a value --array value2
* object|o=s% - would allow 'cmd --object key=value -o key2=value2

### Option Configuration

For the simple case option configuration can be passed just the description
as a string. If you want to specify more than the description you can pass
an Object. The supported keys of that object are:

* description - A description of the parameter for help
* paramName - A descriptive name or example value for help
* test - A function that can test a found value to see if it matches any
required conditions. The function is passed the following parameters
(value, key, getoptLongObject, paramObject). It must return the value,
this allows test to change the type of the value (eg convert a string to an
integer)
* on - Another function that is called after any tests and allows you to
perform other actions, no return value is required.


Configuration
=============

There are a number of configuration options supported

* name - Specify the commands name (if not specified the command name is dertermined by the how node is run
* commandVersion - Specify a version number for the command (also makes --version option appear)
* defaults - Object containing default values for parameters
* helpPrefix - Text to be put at the front of help message
* helpSuffix - Text to be put at the end of the help message
* subCommand - Flag, when set true processing of arguments will stop at the first non-parameter argument (this allows parameters to be passed on to sub-command)
* ignoreCase - TODO - choose weather arguments should be case sensitive or not (default is true)
* bundle - TODO - allow bundling of short arguments (default is true)

