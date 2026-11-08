import assert from 'node:assert';
import { describe, it } from '@jest/globals';
import { GetoptLongParam } from '../getopt-long-param';
import _ from 'underscore';

var test_data: any[] = [
  {
    name: 'Simple help',
    config: ['long|l', { description: 'The long argument1' }],
    help: '  -l --long     The long argument1\n',
  },
  {
    name: 'Simple long help',
    config: ['long|long-option|l', { description: 'The long argument2' }],
    help: '  -l --long-option\n                The long argument2\n',
  },
  {
    name: 'Simple long borderline help',
    config: ['long|long-opti|l', { description: 'The long argument3' }],
    help: '  -l --long-opti\n                The long argument3\n',
  },
  {
    name: 'long option only help',
    config: ['long', { description: 'Only long argument' }],
    help: '     --long     Only long argument\n',
  },
  {
    name: 'short option only help',
    config: ['s', { description: 'Only short argument1' }],
    help: '  -s            Only short argument1\n',
  },
  {
    name: 'short int only help',
    config: ['s=i', { description: 'Only short argument2' }],
    help: '  -s[=]int      Only short argument2\n',
  },
  {
    name: 'short double only help',
    config: ['s=d', { description: 'Only short argument3' }],
    help: '  -s[=]float    Only short argument3\n',
  },
  {
    name: 'short string only help',
    config: ['s=s', { description: 'Only short argument4', paramName: 'a..z' }],
    help: '  -s[=]a..z     Only short argument4\n',
  },
  {
    name: 'short float only help',
    config: [
      's=f',
      { description: 'Only short argument5', paramName: '0.0..9.0' },
    ],
    help: '  -s[=]0.0..9.0 Only short argument5\n',
  },
  {
    name: 'Negatable help',
    config: ['long|l!', { description: 'The long argument' }],
    help: '  -l --long     The long argument\n     --no-long  Turn off this option\n',
  },
  {
    name: 'short int only help',
    config: ['s=i', { description: 'Only short argument6', paramName: '0..9' }],
    help: '  -s[=]0..9     Only short argument6\n',
  },
  {
    name: 'list of values',
    config: [
      's=s',
      {
        description: 'Only short argument7',
        test: ['ALL', 'OPEN', 'MERGED', 'DECLINED'],
      },
    ],
    help: '  -s[=]ALL|OPEN|MERGED|DECLINED\n                Only short argument7\n',
  },
];

describe('Basic help', function () {
  _.each(test_data, function (test: any) {
    it(test.name, function () {
      var param = new GetoptLongParam(test.config);

      if (param.help() !== test.help) {
        console.log('"' + param.help() + '"\n"' + test.help + '"');
      }
      assert.equal(
        param.help(),
        test.help,
        'Get the correct help message line'
      );
    });
  });
});
