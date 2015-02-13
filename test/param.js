/* global require, describe, it, assert, beforeEach */

var assert = require('assert');
var Param = require('../lib/getopt-long-param.js');

var test_data = [
    {
        'name': 'Simple parameter',
        'args': ['long|l', { description: 'A long named option' }],
        'this': [
            [ 'name'       , 'long'                ],
            [ 'possible'   , [ 'long', 'l' ]       ],
            [ 'description', 'A long named option' ],
            [ 'short'      , [ 'l' ]               ]
        ],
        'data': [
            { arg: '--test', match: false, value: null },
            { arg: '--long', match: true , value: true },
            { arg: '-l'    , match: true , value: true },
            { arg: '--log' , match: false, value: null }
        ]
    },
    {
        'name': 'Simple parameter with more options',
        'args': ['long|my-long|l', { description: 'A long named option' }],
        'this': [
            [ 'name',        'long'                     ],
            [ 'possible',    [ 'long', 'my-long', 'l' ] ],
            [ 'description', 'A long named option'      ],
            [ 'short',       [ 'l' ]                    ]
        ],
        'data': [
            { arg: '--test'   , match: false, value: null },
            { arg: '--long'   , match: true , value: true },
            { arg: '--my-long', match: true , value: true },
            { arg: '-l'       , match: true , value: true },
            { arg: '--log'    , match: false, value: null }
        ]
    },
    {
        'name': 'Simple negatable parameter',
        'args': ['long|l!', { description: 'A long negatable named option' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'negatable', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--test'   , match: false, value: null  },
            { arg: '--no-long', match: true , value: false },
            { arg: '--long'   , match: true , value: true  },
            { arg: '-l'       , match: true , value: true  },
            { arg: '--log'    , match: false, value: null  }
        ]
    },
    {
        'name': 'Simple incrementer parameter',
        'args': ['long|l+', { description: 'A long negatable named option' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'increment', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--long'    , match: true , value: 1  },
            { arg: ['-l', '-l'], match: true , value: 2  },
            { arg: '--log'     , match: false, value: null  }
        ]
    },
    {
        'name': 'Simple parameter with an argument ',
        'args': ['long|l=', { description: 'A long option with an argument' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--long=val', match: true , value: 'val'  },
            { arg: '-l'        , match: false, value: null, error: '--long requires a value\n' }
        ]
    },
    {
        'name': 'Simple parameter with an argument ',
        'args': ['long|l=s', { description: 'A long option with a string argument' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--long=val', match: true , value: 'val'  },
            { arg: '-l'        , match: false, value: null, error: '--long requires a value\n' }
        ]
    },
    {
        'name': 'Simple parameter with an int argument ',
        'args': ['long|l=i', { description: 'A long option with an integer' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--long=val', match: false, value: null, error: '--long must be an integer\n' },
            { arg: '--long=7'  , match: true , value: 7    },
            { arg: '--long=0'  , match: true , value: 0    },
            { arg: '-l'        , match: false, value: null, error: '--long requires a value\n' }
        ]
    },
    {
        'name': 'Simple parameter with an float argument ',
        'args': ['long|l=f', { description: 'A long option with an float' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            { arg: '--long=val'   , match: false, value: null, error: '--long must be an number\n' },
            { arg: '--long=7.1'   , match: true , value: 7.1  },
            { arg: '--long=0'     , match: true , value: 0    },
            { arg: ['--long', '0'], match: false, value: 0    },
            { arg: '-l'           , match: false, value: null, error: '--long requires a value\n' }
        ]
    },
    {
        'name': 'Simple parameter with an int argument ',
        'args': [
            'long|l=i',
            {
                description: 'A long option with an integer',
                test: function(val) { if (val < 0) throw '--long must be a positive integer\n'; return val; }
            }
        ],
        'this': [
            ['name', 'long'],
        ],
        'data': [
            { arg: '--long=val', match: false, value: null, error: '--long must be an integer\n' },
            { arg: '--long=7'  , match: true , value: 7    },
            { arg: '--long=-7' , match: false, value: null, error: '--long must be a positive integer\n' },
            { arg: '-l'        , match: false, value: null, error: '--long requires a value\n' }
        ]
    },
    {
        'name': 'Parameter with lots of ints',
        'args': ['long|l=i@', { description: 'A long option with integers' }],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ],
            [ 'value',     [     ]         ]
        ],
        'data': [
            { arg: '--long=val'  , match: false, value: null, error: '--long must be an integer\n' },
            { arg: '--long=7'    , match: true , value: [7]   },
            { arg: '--long=0'    , match: true , value: [0]   },
            { arg: ['--long=0', '--long=1'], match: true , value: [0,1] },
            { arg: '-l'          , match: false, value: null, error: '--long requires a value\n' }
        ]
    }
];

for ( var i in test_data ) {
    (function(data) {
        describe(data.name, function() {

            if (data['this']) {
                for (var j in data['this']) {
                    (function(test) {
                        it('sets ' + test[0], function() {
                            var param, error;
                            try {
                                param = new Param.param(data.args);
                                error = false;
                            }
                            catch (e) {
                                error = e;
                            }
                            assert(!error, 'No error creating new parameter');
                            assert.deepEqual(param[test[0]], test[1], test[2]);
                        });
                    })(data['this'][j]);
                }
            }

        for (var k in data.data) {
            (function(test) {
                var call = '"' + ( test.arg instanceof Array ? test.arg.join(' ') : test.arg ) + '"';
                it('with parameter ' + call, function() {
                      var param, match, error;
                      try {
                          param = new Param.param(data.args);
                          if (test.arg instanceof Array) {
                              match = true;
                              while (test.arg.length) {
                                  match = match && param.process.apply(param, test.arg);
                                  test.arg.shift();
                              }
                          }
                          else {
                              match = param.process(test.arg);
                          }
                          error = false;
                      }
                      catch (e) {
                          error = e;
                      }
                      if (!test.error) {
                          if (test.value !== param.value || error) {
                              console.log('Expect no errors\n', {
                                  param: param,
                                  error: error,
                                  match: match,
                                  test : test
                              });
                          }
                          assert(!error, 'No error creating new parameter');
                          assert.equal(test.match, match, 'Check that ' + call + ' set ' + (test.match ? 'matches' : 'does not match'));
                          if ( typeof param.value === 'object' ) {
                              assert.deepEqual(test.value, param.value, 'Check that ' + call + ' set value to ' + test.value);
                          }
                          else {
                              assert.equal(test.value, param.value, 'Check that ' + call + ' set value to ' + test.value);
                          }
                      }
                      else {
                          if (test.error !== error) {
                              console.log('Expect errors\n', {
                                  param: param,
                                  error: error,
                                  test : test
                              });
                          }
                          assert.equal(test.error, error, 'Check that ' + call + ' throws and error');
                      }
                });
            })(data.data[k]);
        }

//          for (var k in data.bad) {
//              (function(test) {
//                  it(test, function() {
//                        var error;
//                        try {
//                            param.process(test.argv);
//                        }
//                        catch (e) {
//                            error = e;
//                        }
//                        assert.true(!!error);
//                  });
//              })(data.bad[k]);
//          }
        });
    })(test_data[i]);
}
