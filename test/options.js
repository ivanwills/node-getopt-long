/* global require, describe, it, assert, beforeEach */
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');

var test_data = [
    {
        'name'  : 'Simple',
        'args'  : ['long|l', 'A long named option'],
        'params': [
        ],
        'cmdline': [
            { argv: ['--long'] },
            { argv: ['-l'    ] }
        ],
    }
];

for ( var i in test_data ) {
    (function(data) {
        describe(data.name, function() {
            for (var j in data.cmdline) {
                (function(test) {
                    it(test, function() {
                        var error, opt;
                        try {
                            opt = getoptLong.configure(data.args);
                        }
                        catch (e) {
                            error = e;
                        }
                    });
                })(data.cmdline[j]);
            }

            for (var k in data.params) {
                (function(test) {
                    it(test, function() {
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
