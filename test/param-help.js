/* global require, describe, it, assert, beforeEach */

var assert = require('assert');
var Param = require('../lib/getopt-long-param.js');

var test_data = [
    {
        name  : 'Simple help',
        config: ['long|l', {description: 'The long argument'}],
        help  : '  -l --long     The long argument\n'
    },
    {
        name  : 'Simple long help',
        config: ['long|long-option|l', {description: 'The long argument'}],
        help  : '  -l --long-option \n                The long argument\n'
    },
    {
        name  : 'long option only help',
        config: ['long', {description: 'Only long argument'}],
        help  : '     --long     Only long argument\n'
    },
    {
        name  : 'short option only help',
        config: ['s', {description: 'Only short argument'}],
        help  : '  -s            Only short argument\n'
    }
];

describe('Basic help', function () {
    for (var i in test_data) {
        (function(test) {
            it(test.name, function() {
                var param = new Param.param(test.config);

                if (param.help() !== test.help) {
                    console.log('"'+param.help()+'"\n"'+test.help+'"');
                }
                assert.equal(
                    param.help(),
                    test.help,
                    'Get the correct help message line'
                );
            });
        })(test_data[i]);
    }
});
