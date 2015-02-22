/* global require, describe, it, assert, beforeEach */
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');

var test_data = [
    {
        name  : '',
        config: [
        ],
        help: '',
    }
];

describe('Full help', function() {
    for (var i in test_data) {
        (function(test) {
            it(test.name, function() {
                try {
                var opt = getoptLong.configure(test.config);
                }
                catch (e) {
                    console.log(e);
                }
                assert.equals(test.help, opt.help(), 'help generated correctly');
            });
        })(test_data[i]);
    }
});
