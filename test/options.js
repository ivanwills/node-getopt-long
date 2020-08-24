/* global require, describe, it, beforeEach, afterEach, process */
var _ = require('underscore');
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');

var test_data = [
    {
        'name'  : 'Simple',
        'args'  : [['long|l', 'A long named option']],
        'params': [
        ],
        'cmdline': [
            {
                name: 'passed long option',
                argv: ['--long']
            },
            {
                name: 'passed short option',
                argv: ['-l'    ]
            }
        ],
    },
    {
        'name'  : 'Simple object',
        'args'  : [['long|l', {description: 'A long named option'}]],
        'params': [
        ],
        'cmdline': [
            {
                name  : 'passed long option',
                argv  : ['--long'],
                params: { long: true }
            },
            {
                name  : 'passed short option',
                argv  : ['-l', 'a'],
                extra : ['a'],
                params: { long: true }
            }
        ],
    },
    {
        'name'  : 'Object with value arguments',
        'args'  : [
            ['long|l', {description: 'A long named option'}],
            ['int|i=i', {description: 'A long named option'}],
        ],
        'cmdline': [
            {
                name  : 'passed short option',
                argv  : ['-l', '-i', '1'],
                extra : [],
                params: { long: true, int: 1 }
            },
            {
                name  : 'passed short option',
                argv  : ['-li1'],
                extra : [],
                params: { long: true, int: 1 }
            }
        ],
    },
    {
        'name'  : 'Object with value arguments',
        'args'  : [
            ['long|l', {description: 'A long named option'}],
            ['verbose|v+', {description: 'A long named option'}],
        ],
        'cmdline': [
            {
                name  : 'passed short option',
                argv  : ['-l', '-v', '-v'],
                extra : [],
                params: { long: true, verbose: 2 }
            },
            {
                name  : 'passed short option',
                argv  : ['-vlv'],
                extra : [],
                params: { long: true, verbose: 2 }
            },
            {
                name  : 'Error on unknown arg',
                argv  : ['-q'],
                error : 'Unknown argument -q\n'
            },
            {
                name  : 'terminate on --',
                argv  : ['-vlv', '--', 'garbage', '--ignore'],
                extra : ['garbage', '--ignore'],
                params: { long: true, verbose: 2 }
            }
        ],
    },
    {
        'name'  : 'Default values',
        'args'  : [
            ['long|l=s', {description: 'A long named option'}],
            ['other|o=i', {description: 'An other named option'}],
        ],
        'config' : {
            defaults : {
                long : 'Long',
                other: 6
            }
        },
        'cmdline': [
            {
                name  : 'passed short option',
                argv  : [],
                extra : [],
                params: { long: 'Long', other: 6 }
            },
            {
                name  : 'passed short option',
                argv  : ['-l', 'my long'],
                extra : [],
                params: { long: 'my long', other: 6 }
            },
            {
                name  : 'passed short option',
                argv  : ['--long', 'my long', '-o3'],
                extra : [],
                params: { long: 'my long', other: 3 }
            },
            {
                name  : 'terminate on --',
                argv  : ['--other', 3],
                extra : [],
                params: { long: 'Long', other: 3 }
            }
        ],
    },
    {
        'name'  : 'Sub command values',
        'args'  : [
            ['long|l=s', {description: 'A long named option'}],
            ['other|o=i', {description: 'An other named option'}],
            ['verbose|v+', 'Verbose option that might be supplied by sub-command'],
        ],
        'config' : {
            subCommand: true,
        },
        'cmdline': [
            {
                name  : 'No sub-command passed',
                argv  : ['-v'],
                extra : [],
                params: { verbose: 1 }
            },
            {
                name  : 'sub-command passed',
                argv  : ['-v', 'sub'],
                extra : ['sub'],
                params: { verbose: 1 }
            },
            {
                name  : 'sub-command passed with extra verbose',
                argv  : ['-v', 'sub', '-v'],
                extra : ['sub', '-v'],
                params: { verbose: 1 }
            }
        ],
    }
];

_.each(test_data, function(data) {
    describe(data.name, function() {
        var exit     = process.exit,
            outWrite = process.stdout.write,
            errWrite = process.stderr.write,
            exitedWith,
            outText,
            errText;

        beforeEach(function() {
            // hack in alt exit method for testing
            process.exit = function(code) {
                exitedWith = code;
            };
            process.stdout.write = function(text) {
                outText = text;
            };
            process.stderr.write = function(text) {
                errText = text;
            };
        });
        afterEach(function() {
            // restore real exit
            process.exit = exit;
            process.stdout.write = outWrite;
            process.stderr.write = errWrite;
        });

        _.each(data.cmdline, function(test) {
            it(test.name, function() {
                var error, opt, result;
                try {
                    test.argv.unshift('node', 'test');
                    if (data.config) {
                        data.config.argv = test.argv;
                    }
                    else {
                        process.argv = test.argv;
                    }
                    opt = getoptLong.configure(data.args, data.config);
                    if (test.hasOwnProperty('extra')) {
                        test.extra.unshift('node', 'test');
                    }
                    result = opt.process();
                    error = false;
                }
                catch (e) {
                    error = e;
                }
                if (error && !test.error) {
                    console.log({error: error, opt: opt.parameters, params: result, argv: process.argv, test: test});
                }
                if (test.error) {
                    assert.equal(errText, test.error, 'Get the expected error');
                }
                else {
                    assert.equal(error, false, 'No error creating object');
                }
                if (test.params) {
                    assert.deepEqual(test.params, result, 'Get the expected params set ('+JSON.stringify(test.params)+' vs '+JSON.stringify(result)+')');
                }
                if (test.extra) {
                    assert.deepEqual(
                        test.extra,
                        data.config ? opt.argv : process.argv,
                        'Get the expected leftover arguments set'
                    );
                }
            });
        });

        _.each(data.params, function(test) {
            it(test.name, function() {
                var error, opt;
                try {
                    opt = getoptLong.options(data.args);
                }
                catch (e) {
                   error = e;
                }
                assert.true(!error, test.error);
                assert.equal(test.value, opt[test.param], 'Test that ' + test.param + ' is equal to ' + test.value + ' (actual is ' + opt[test.param] + ')');
            });
        });

    });
});

describe('Simplest usage', function() {
    it('use options', function() {
        var opt = {}, error = false;
        try {
            process.argv = ['node', 'test', '--long'];
            opt = getoptLong.options([
                ['long|l', 'Long options']
            ], {defaults: {} });
        }
        catch (e) {
            error = e;
        }
        assert.equal(error, false, 'No errors using option');
        assert.deepEqual(opt, {long: true}, 'Get the answer that we expect');
    });
});

describe('Protections', function() {
    beforeEach(function() {
        Array.prototype.junk = true;
        Object.prototype.garbage = true;
    });
    afterEach(function() {
        delete Array.prototype.junk;
        delete Object.prototype.junk;
    });
    it('not own properties ignored', function() {
        var error = false;
        try {
            var opt = new getoptLong.get();
            opt.configure([['log|l', { description: 'long option' }]]);
            process.argv = ['node', 'test', '-l'];
            opt.process();
        }
        catch (e) {
            error = e;
        }
        assert.equal(error, false, 'No error given when array has extra prototype property');
    });
});
