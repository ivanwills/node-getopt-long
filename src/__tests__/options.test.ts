import _ from 'underscore';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from '@jest/globals';
import getoptLong from '../getopt-long';

var test_data: any[] = [
  {
    name: 'Simple',
    args: [['long|l', 'A long named option1']],
    params: [],
    cmdline: [
      {
        name: 'passed long option',
        argv: ['--long'],
      },
      {
        name: 'passed short option1',
        argv: ['-l'],
      },
    ],
  },
  {
    name: 'Simple object',
    args: [['long|l', { description: 'A long named option2' }]],
    params: [],
    cmdline: [
      {
        name: 'passed long option',
        argv: ['--long'],
        params: { long: true },
      },
      {
        name: 'passed short option2',
        argv: ['-l', 'a'],
        extra: ['a'],
        params: { long: true },
      },
    ],
  },
  {
    name: 'Object with value arguments',
    args: [
      ['long|l', { description: 'A long named option3' }],
      ['int|i=i', { description: 'A long named option4' }],
    ],
    cmdline: [
      {
        name: 'passed short option3',
        argv: ['-l', '-i', '1'],
        extra: [],
        params: { long: true, int: 1 },
      },
      {
        name: 'passed short option4',
        argv: ['-li1'],
        extra: [],
        params: { long: true, int: 1 },
      },
    ],
  },
  {
    name: 'Object with value arguments',
    args: [
      ['long|l', { description: 'A long named option5' }],
      ['verbose|v+', { description: 'A long named option6' }],
    ],
    cmdline: [
      {
        name: 'passed short option5',
        argv: ['-l', '-v', '-v'],
        extra: [],
        params: { long: true, verbose: 2 },
      },
      {
        name: 'passed short option6',
        argv: ['-vlv'],
        extra: [],
        params: { long: true, verbose: 2 },
      },
      {
        name: 'Error on unknown arg',
        argv: ['-q'],
        error: 'Unknown argument -q\n',
      },
      {
        name: 'terminate on --',
        argv: ['-vlv', '--', 'garbage', '--ignore'],
        extra: ['garbage', '--ignore'],
        params: { long: true, verbose: 2 },
      },
    ],
  },
  {
    name: 'Default values',
    args: [
      ['long|l=s', { description: 'A long named option7' }],
      ['other|o=i', { description: 'An other named option' }],
    ],
    config: {
      defaults: {
        long: 'Long',
        other: 6,
      },
    },
    cmdline: [
      {
        name: 'passed short option7',
        argv: [],
        extra: [],
        params: { long: 'Long', other: 6 },
      },
      {
        name: 'passed short option8',
        argv: ['-l', 'my long'],
        extra: [],
        params: { long: 'my long', other: 6 },
      },
      {
        name: 'passed short option9',
        argv: ['--long', 'my long', '-o3'],
        extra: [],
        params: { long: 'my long', other: 3 },
      },
      {
        name: 'terminate on --',
        argv: ['--other', 3],
        extra: [],
        params: { long: 'Long', other: 3 },
      },
    ],
  },
  {
    name: 'Sub command values',
    args: [
      ['long|l=s', { description: 'A long named option8' }],
      ['other|o=i', { description: 'An other named option' }],
      ['verbose|v+', 'Verbose option that might be supplied by sub-command'],
    ],
    config: {
      subCommand: true,
    },
    cmdline: [
      {
        name: 'No sub-command passed',
        argv: ['-v'],
        extra: [],
        params: { verbose: 1 },
      },
      {
        name: 'sub-command passed',
        argv: ['-v', 'sub'],
        extra: ['sub'],
        params: { verbose: 1 },
      },
      {
        name: 'sub-command passed with extra verbose',
        argv: ['-v', 'sub', '-v'],
        extra: ['sub', '-v'],
        params: { verbose: 1 },
      },
    ],
  },
];

_.each(test_data, function (data: any) {
  describe(data.name, function () {
    var exit: any = process.exit,
      outWrite: any = process.stdout.write,
      errWrite: any = process.stderr.write,
      errText: any;

    beforeEach(function () {
      // hack in alt exit method for testing
      (process as any).exit = function () {};
      (process.stdout as any).write = function () {};
      (process.stderr as any).write = function (text: string) {
        errText = text;
      };
    });
    afterEach(function () {
      // restore real exit
      (process as any).exit = exit;
      (process.stdout as any).write = outWrite;
      (process.stderr as any).write = errWrite;
    });

    _.each(data.cmdline, function (test: any) {
      it(test.name, function () {
        var error: any, opt: any, result: any;
        try {
          test.argv.unshift('node', 'test');
          if (data.config) {
            data.config.argv = test.argv;
          } else {
            process.argv = test.argv;
          }
          opt = getoptLong.configure(data.args, data.config);
          if (test.hasOwnProperty('extra')) {
            test.extra.unshift('node', 'test');
          }
          result = opt.process();
          error = false;
        } catch (e) {
          error = e;
        }
        if (error && !test.error) {
          console.log({
            error: error,
            opt: opt.parameters,
            params: result,
            argv: process.argv,
            test: test,
          });
        }
        if (test.error) {
          assert.equal(errText, test.error, 'Get the expected error');
        } else {
          assert.equal(error, false, 'No error creating object');
        }
        if (test.params) {
          assert.deepEqual(
            test.params,
            result,
            'Get the expected params set (' +
              JSON.stringify(test.params) +
              ' vs ' +
              JSON.stringify(result) +
              ')'
          );
        }
        if (test.extra) {
          assert.deepEqual(
            test.extra,
            data.config ? opt.argv : process.argv,
            'Get the expected leftover arguments set'
          );
        }
      });
    });

    _.each(data.params, function (test: any) {
      it(test.name, function () {
        var error: any, opt: any;
        try {
          opt = getoptLong.options(data.args);
        } catch (e) {
          error = e;
        }
        assert.ok(!error, test.error);
        assert.equal(
          test.value,
          opt[test.param],
          'Test that ' +
            test.param +
            ' is equal to ' +
            test.value +
            ' (actual is ' +
            opt[test.param] +
            ')'
        );
      });
    });
  });
});

describe('Simplest usage', function () {
  it('use options', function () {
    var opt: any = {},
      error: any = false;
    try {
      process.argv = ['node', 'test', '--long'];
      opt = getoptLong.options([['long|l', 'Long options']], { defaults: {} });
    } catch (e) {
      error = e;
    }
    assert.equal(error, false, 'No errors using option');
    assert.deepEqual(opt, { long: true }, 'Get the answer that we expect');
  });
});

describe('Protections', function () {
  beforeEach(function () {
    (Array.prototype as any).junk = true;
    (Object.prototype as any).garbage = true;
  });
  afterEach(function () {
    delete (Array.prototype as any).junk;
    delete (Object.prototype as any).junk;
  });
  it('not own properties ignored', function () {
    var error: any = false;
    try {
      var opt = new getoptLong.get();
      opt.configure([['log|l', { description: 'long option' }]]);
      process.argv = ['node', 'test', '-l'];
      opt.process();
    } catch (e) {
      error = e;
    }
    assert.equal(
      error,
      false,
      'No error given when array has extra prototype property'
    );
  });
});
