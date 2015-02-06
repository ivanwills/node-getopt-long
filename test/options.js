/* global require, describe, it, assert beforeEach */
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');
console.log(getoptLong);

var test_data = [
    {
        'name': 'Simple',
        'args': ['long|l', 'A long named option'],
        'good': ['--long', '-l'],
        'bad' : ['--log', '--q', '-q'],
    }
];

for ( var i in test_data ) {
    (function(data) {
        describe(data.name, function() {
            var opt;
            beforeEach(function() {
                opt = getoptLong.configure(data.args);
            });

            for (var j in data.good) {
                (function(test) {
                    it(test, function() {
//                        opt.process(test.argv);
//                        assert.equal(opt[name], test.result);
                    });
                })(data.good[j]);
            }

            for (var k in data.bad) {
                (function(test) {
                    it(test, function() {
//                        var error;
//                        try {
//                            opt.process(test.argv);
//                        }
//                        catch (e) {
//                            error = e;
//                        }
//                        assert.true(!!error);
                    });
                })(data.bad[k]);
            }

        });
    })(test_data[i]);
}
