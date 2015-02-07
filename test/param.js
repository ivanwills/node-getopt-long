/* global require, describe, it, assert, beforeEach */

var assert = require('assert');
var Param = require('../lib/getopt-long-param.js');
console.log('Param : ', Param);

var test_data = [
    {
        'name': 'Simple parameter',
        'args': ['long|l', 'A long named option'],
        'this': [
            [ 'name',     'long'          ],
            [ 'possible', [ 'long', 'l' ] ],
            [ 'short',    [ 'l' ]         ]
        ],
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
