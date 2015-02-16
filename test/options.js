/* global require, describe, it, assert, beforeEach */
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
    }
];

for ( var i in test_data ) {
    (function(data) {
        describe(data.name, function() {
            for (var j in data.cmdline) {
                (function(test) {
                    it(test.name, function() {
                        var error, opt, result;
                        try {
                            opt = getoptLong.configure(data.args);
                            process.argv = test.argv;
                            process.argv.unshift('node', 'test');
                            if (test.hasOwnProperty('extra')) {
                                test.extra.unshift('node', 'test');
                            }
                            result = opt.process();
                            error = false;
                        }
                        catch (e) {
                            error = e;
                        }
                        if (error) {
                            console.log({error: error, opt: opt.parameters, params: result, argv: process.argv, test: test});
                        }
                        assert.equal(error, false, 'No error creating object');
                        if (test.params) {
                            assert.deepEqual(test.params, result, 'Get the expected params set');
                        }
                        if (test.extra) {
                            assert.deepEqual(test.extra, process.argv, 'Get the expected leftover arguments set');
                        }
                    });
                })(data.cmdline[j]);
            }

            for (var k in data.params) {
                (function(test) {
                    it(test.name, function() {
                        var error, opt;
                        try {
                            opt = getoptLong.configure(data.args);
                        }
                        catch (e) {
                           error = e;
                        }
                        assert.true(!error, test.error);
                        assert.equal(test.value, opt[test.param], 'Test that ' + test.param + ' is equal to ' + test.value + ' (actual is ' + opt[test.param] + ')');
                    });
                })(data.params[k]);
            }

        });
    })(test_data[i]);
}

describe('Protections', function() {
    beforeEach(function() {
        Array.prototype.junk = true;
        Object.prototype.junk = true;
    });
    afterEach(function() {
        delete Array.prototype.junk;
        delete Object.prototype.junk;
    });
    it('not own properties ignored', function() {
        var error = false;
        try {
            var opt = getoptLong.configure([['log|l', { description: 'long option' }]]);
            process.argv = ['node', 'test', '-l'];
            opt.process();
        }
        catch (e) {
            error = e;
        }
        assert.equal(error, false, 'No error given when array has extra prototype property');
    });
});

