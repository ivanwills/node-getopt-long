import _ from 'underscore';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from '@jest/globals';
import getoptLong from '../getopt-long';

var test_data: any[] = [
  {
    name: 'Short config',
    config: [[['long|l', 'Long message']], {}],
    ARGV: ['gulp', 'test', '--help'],
    help:
      '  gulp\n' +
      '\n' +
      ' Options:\n' +
      '  -l --long     Long message\n' +
      '     --help     Show this help message\n' +
      '     --version  Show the version of this command\n',
  },
  {
    name: 'Specify command name',
    config: [
      [['long|l', 'Long message']],
      {
        name: 'test.js',
      },
    ],
    parameters: {
      name: 'test.js',
    },
    help:
      '  test.js\n' +
      '\n' +
      ' Options:\n' +
      '  -l --long     Long message\n' +
      '     --help     Show this help message\n' +
      '     --version  Show the version of this command\n',
  },
  {
    name: 'Specify help suffix',
    config: [
      [['long|l', 'Long message']],
      {
        helpSuffix: ' Eg test --long',
      },
    ],
    parameters: {
      helpSuffix: ' Eg test --long',
    },
    help:
      '  test\n' +
      '\n' +
      ' Options:\n' +
      '  -l --long     Long message\n' +
      '     --help     Show this help message\n' +
      '     --version  Show the version of this command\n' +
      '\n' +
      ' Eg test --long\n',
  },
  {
    name: 'Specify help prefix',
    config: [
      [['long|l', 'Long message']],
      {
        helpPrefix: '  test --long\n',
      },
    ],
    parameters: {
      helpPrefix: '  test --long\n',
    },
    help:
      '  test\n' +
      '  test --long\n' +
      ' Options:\n' +
      '  -l --long     Long message\n' +
      '     --help     Show this help message\n' +
      '     --version  Show the version of this command\n',
  },
  {
    name: 'Specify command version in help',
    config: [
      [['long|l', 'Long message']],
      {
        commandVersion: 0.1,
      },
    ],
    argv: ['--help'],
    exit: 1,
    parameters: {
      commandVersion: 0.1,
    },
    help:
      '  test\n' +
      '\n' +
      ' Options:\n' +
      '  -l --long     Long message\n' +
      '     --help     Show this help message\n' +
      '     --version  Show the version of this command\n',
  },
];

describe('Full help', function () {
  var exit: any = process.exit,
    outWrite: any = process.stdout.write,
    errWrite: any = process.stderr.write,
    exitedWith: any;

  beforeEach(function () {
    // hack in alt exit method for testing
    (process as any).exit = function (code: number) {
      exitedWith = code;
    };
    (process.stdout as any).write = function () {};
    (process.stderr as any).write = function () {};
  });
  afterEach(function () {
    // restore real exit
    (process as any).exit = exit;
    (process.stdout as any).write = outWrite;
    (process.stderr as any).write = errWrite;
  });

  _.each(test_data, function (test: any) {
    it(test.name, function () {
      var obj: any;
      if (test.ARGV) {
        process.argv = test.ARGV;
      } else {
        process.argv = test.argv ? test.argv : [];
        process.argv.unshift('node', 'test');
      }
      try {
        obj = getoptLong.configure(test.config[0], test.config[1]);
        obj.process();
      } catch (e) {
        console.log(e);
      }

      if (test.parameters) {
        _.each(test.parameters, function (params: any, key: string) {
          assert.equal(
            params,
            obj[key],
            'Check that ' +
              key +
              ' is set to ' +
              params +
              ' (got "' +
              obj[key] +
              '")'
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
          'Check that script exited with ' +
            test.exit +
            ' (got ' +
            exitedWith +
            ')'
        );
      }
    });
  });
});

describe('Showing version number', function () {
  var exit: any, write: any, txt: any;
  beforeEach(function () {
    exit = process.exit;
    write = process.stdout.write;
    (process as any).exit = function () {};
    (process.stdout as any).write = function (str: string) {
      txt = str;
    };
  });
  afterEach(function () {
    (process as any).exit = exit;
    (process.stdout as any).write = write;
  });
  it('Unsafe config prototype items', function () {
    process.argv = ['node', 'test', '--version'];
    var opt: any;
    try {
      opt = getoptLong.configure([['long|l', 'Long message']], {
        name: '~/foo',
        commandVersion: '1.1.0',
      });
      opt.process();
    } catch (e) {
      console.log(e);
    }

    assert.equal(
      '~/foo version 1.1.0\n',
      txt,
      'Version text generated correctly'
    );
  });
});

describe('Help with object prototype extras', function () {
  beforeEach(function () {
    (Array.prototype as any).junk = true;
    (Object.prototype as any).junk = true;
  });
  afterEach(function () {
    delete (Array.prototype as any).junk;
    delete (Object.prototype as any).junk;
  });

  it('Unsafe config prototype items', function () {
    process.argv = ['node', 'test'];
    var opt: any;
    try {
      opt = getoptLong.configure([['long|l', 'Long message']], {
        name: '~/foo',
      });
    } catch (e) {
      console.log(e);
    }

    assert.equal(
      '  ~/foo\n' +
        '\n' +
        ' Options:\n' +
        '  -l --long     Long message\n' +
        '     --help     Show this help message\n' +
        '     --version  Show the version of this command\n',
      opt.help(),
      'Help text generated correctly'
    );
  });
});
