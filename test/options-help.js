/* global require, describe, it, assert, beforeEach */
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');

var test_data = [
    {
        name  : 'Short config',
        config: [[
                ['long|l', "Long message"]
            ],
            {}
        ],
        help: '  test\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
    },
    {
        name  : 'Specify command name',
        config: [[
                ['long|l', "Long message"]
            ],
            {
                name: 'test.js'
            }
        ],
        help: '  test.js\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
    }
];

describe('Full help', function() {
    for (var i in test_data) {
        (function(test) {
            it(test.name, function() {
                process.argv = ['node', 'test'];
                try {
                    var opt = getoptLong.configure.apply(this, test.config);
                }
                catch (e) {
                    console.log(e);
                }
                assert.equal(test.help, opt.help(), 'help generated correctly\n"' + test.help + '"\n"' + opt.help() + '"\n');
            });
        })(test_data[i]);
    }
});
