/* global require, describe, it */

var assert = require('assert');
var Param = require('../lib/getopt-long-param.js');
var _ = require('underscore');

var test_data = [
    {
        name  : 'Simple help',
        config: ['long|l', {description: 'The long argument'}],
        help  : '  -l --long     The long argument\n'
    },
    {
        name  : 'Simple long help',
        config: ['long|long-option|l', {description: 'The long argument'}],
        help  : '  -l --long-option\n                The long argument\n'
    },
    {
        name  : 'Simple long borderline help',
        config: ['long|long-opti|l', {description: 'The long argument'}],
        help  : '  -l --long-opti\n                The long argument\n'
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
    },
    {
        name  : 'short int only help',
        config: ['s=i', {description: 'Only short argument'}],
        help  : '  -s[=]int      Only short argument\n'
    },
    {
        name  : 'short float only help',
        config: ['s=d', {description: 'Only short argument'}],
        help  : '  -s[=]float    Only short argument\n'
    },
    {
        name  : 'short string only help',
        config: ['s=s', {description: 'Only short argument', paramName: 'a..z'}],
        help  : '  -s[=]a..z     Only short argument\n'
    },
    {
        name  : 'short float only help',
        config: ['s=f', {description: 'Only short argument', paramName: '0.0..9.0'}],
        help  : '  -s[=]0.0..9.0 Only short argument\n'
    },
    {
        name  : 'short float only help',
        config: ['s=i', {description: 'Only short argument', paramName: '0..9'}],
        help  : '  -s[=]0..9     Only short argument\n'
    }
];

describe('Basic help', function() {
    _.each(test_data, function(test) {
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
    });
});
