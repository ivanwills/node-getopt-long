/* global require, describe, it, assert, beforeEach */

var assert = require('assert');
var Param = require('../lib/getopt-long-param.js');

var test_data = [
    {
        'name': 'Simple parameter',
        'args': ['long|l', 'A long named option'],
        'this': [
            [ 'name',     'long'          ],
            [ 'possible', [ 'long', 'l' ] ],
            [ 'short',    [ 'l' ]         ]
        ],
        'data': [
            [ '--test', false, null ],
            [ '--long', true , true ],
            [ '-l'    , true , true ],
            [ '--log' , false, null ]
        ]
    },
    {
        'name': 'Simple negatable parameter',
        'args': ['long|l!', 'A long negatable named option'],
        'this': [
            [ 'name',      'long'          ],
            [ 'negatable', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            [ '--test'   , false, null  ],
            [ '--no-long', true , false ],
            [ '--long'   , true , true  ],
            [ '-l'       , true , true  ],
            [ '--log'    , false, null  ]
        ]
    },
    {
        'name': 'Simple incrementer parameter',
        'args': ['long|l+', 'A long negatable named option'],
        'this': [
            [ 'name',      'long'          ],
            [ 'increment', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            [ '--long'    , true , 1  ],
            [ ['-l', '-l'], true , 2  ],
            [ '--log'     , false, null  ]
        ]
    },
    {
        'name': 'Simple parameter with an argument ',
        'args': ['long|l=', 'A long negatable named option'],
        'this': [
            [ 'name',      'long'          ],
            [ 'parameter', true            ],
            [ 'possible',  [ 'long', 'l' ] ],
            [ 'short',     [ 'l' ]         ]
        ],
        'data': [
            [ '--long=val', true , 'val'  ],
            [ '-l'        , false, null   ]
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
                  it('with parameter ' + test[0], function() {
                        var param, match, error;
                        try {
                            param = new Param.param(data.args);
                            if (test[0] instanceof Array) {
                                match = true;
                                for (var x in test[0]) {
                                    match = match && param.process(test[0][x]);
                                }
                            }
                            else {
                                match = param.process(test[0]);
                            }
                            error = false;
                        }
                        catch (e) {
                            error = e;
                        }
                        assert(!error, 'No error creating new parameter');
                        assert.equal(test[1], match, 'Check that ' + test[0] + ' set ' + (test[1] ? 'matches' : 'does not match'));
                        assert.equal(test[2], param.value, 'Check that ' + test[0] + ' set value to ' + test[2]);
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
