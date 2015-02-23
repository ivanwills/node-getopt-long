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
    },
    {
        name  : 'Specify help suffix',
        config: [[
                ['long|l', "Long message"]
            ],
            {
                helpSuffix: ' Eg test --long',
            }
        ],
        help: '  test\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '\n'
            + ' Eg test --long\n'
    },
    {
        name  : 'Specify help prefix',
        config: [[
                ['long|l', "Long message"]
            ],
            {
                helpPrefix: '  test --long\n'
            }
        ],
        help: '  test\n'
            + '  test --long\n'
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

describe('Help with object prototype extras', function() {
    beforeEach(function() {
        Array.prototype.junk = true;
        Object.prototype.junk = true;
    });
    afterEach(function() {
        delete Array.prototype.junk;
        delete Object.prototype.junk;
    });

    it('Unsafe config prototype items', function() {
        process.argv = ['node', 'test'];
        var opt;
        try {
            opt = getoptLong.configure([
                    ['long|l', "Long message"]
                ],
                {
                    name: '~/foo',
                }
            );
        }
        catch (e) {
            console.log(e);
        }
        assert.equal('  ~/foo\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            , opt.help()
            , 'Help text generated correctly'
        );
    });
});
