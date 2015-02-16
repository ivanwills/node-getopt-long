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
                name: 'passed long option',
                argv: ['--long']
            },
            {
                name: 'passed short option',
                argv: ['-l'    ]
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
                            result = opt.process();
                            error = false;
                        }
                        catch (e) {
                            error = e;
                        }
                        if (error) {
                            console.log('Error ', error, opt, result);
                        }
                        assert.equal(error, false, 'No error creating object');
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
    });
    afterEach(function() {
        delete Array.prototype.junk;
    });
    it('not own properties ignored', function() {
        var error = false;
        try {
            var opt = getoptLong.configure([['log|l', 'long option']]);
        }
        catch (e) {
            error = e;
        }
        console.log(error);
        assert.equal(error, false, 'No error given when array has extra prototype property');
    });
});

