/* global process, require, describe, it, beforeEach, afterEach */
var _ = require('underscore');
var assert = require('assert');
var getoptLong = require('../lib/getopt-long.js');

var test_data = [
    {
        name  : 'Short config',
        config: [[
                ['long|l', 'Long message']
            ],
            {}
        ],
        ARGV: ['gulp', 'test', '--help'],
        help: '  gulp\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
    },
    {
        name  : 'Specify command name',
        config: [[
                ['long|l', 'Long message']
            ],
            {
                name: 'test.js'
            }
        ],
        parameters: {
            name: 'test.js'
        },
        help: '  test.js\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
    },
    {
        name  : 'Specify help suffix',
        config: [[
                ['long|l', 'Long message']
            ],
            {
                helpSuffix: ' Eg test --long',
            }
        ],
        parameters: {
            helpSuffix: ' Eg test --long',
        },
        help: '  test\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
            + '\n'
            + ' Eg test --long\n'
    },
    {
        name  : 'Specify help prefix',
        config: [[
                ['long|l', 'Long message']
            ],
            {
                helpPrefix: '  test --long\n'
            }
        ],
        parameters: {
            helpPrefix: '  test --long\n'
        },
        help: '  test\n'
            + '  test --long\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
    },
    {
        name  : 'Specify command version in help',
        config: [[
                ['long|l', 'Long message']
            ],
            {
                commandVersion: 0.1
            }
        ],
        argv: ['--help'],
        exit: 1,
        parameters: {
            commandVersion: 0.1
        },
        help: '  test\n'
            + '\n'
            + ' Options:\n'
            + '  -l --long     Long message\n'
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
    }
];

describe('Full help', function() {
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

    _.each(test_data, function(test) {
        it(test.name, function() {
            var obj, opt;
            if (test.ARGV) {
                process.argv = test.ARGV;
            }
            else {
                process.argv = test.argv ? test.argv : [];
                process.argv.unshift('node', 'test');
            }
            try {
                obj = getoptLong.configure.apply(this, test.config);
                opt = obj.process();
            }
            catch (e) {
                console.log(e);
            }

            if (test.parameters) {
                _.each(test.parameters, function(params, key) {
                    assert.equal(
                        params,
                        obj[key],
                        'Check that ' + key + ' is set to ' + params + ' (got "' + obj[key] + '")'
                    );
                });
            }

            assert.equal(
                test.help,
                obj.help(),
                'help generated correctly\n"' + test.help + '"\n"' + obj.help() + '"\n'
            );

            if (test.exit) {
                assert.equal(
                    test.exit,
                    exitedWith,
                    'Check that script exited with ' + test.exit + ' (got ' + exitedWith + ')'
                );
            }
        });
    });
});

describe('Showing version number', function() {
    var exit, write, txt;
    beforeEach(function() {
        exit = process.exit;
        write = process.stdout.write;
        process.exit = function() {
        };
        process.stdout.write = function(str) {
            txt = str;
        };
    });
    afterEach(function() {
        process.exit = exit;
        process.stdout.write = write;
    });
    it('Unsafe config prototype items', function() {
        process.argv = ['node', 'test', '--version'];
        var opt;
        try {
            opt = getoptLong.configure([
                    ['long|l', 'Long message']
                ],
                {
                    name: '~/foo',
                    commandVersion: '1.1.0'
                }
            );
            opt.process();
        }
        catch (e) {
            console.log(e);
        }

        assert.equal('~/foo version 1.1.0\n'
            , txt
            , 'Version text generated correctly'
        );
    });
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
                    ['long|l', 'Long message']
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
            + '     --help     Show this help message\n'
            + '     --version  Show the version of this command\n'
            , opt.help()
            , 'Help text generated correctly'
        );
    });
});
