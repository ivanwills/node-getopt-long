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
        'data': [
            //[ '--test', false, null ],
            //[ '--long', true , true ],
            //[ '-l'    , true , true ],
            [ '--log' , false, null ]
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
                  it(test, function() {
                        var param, match, error;
                        try {
                            param = new Param.param(data.args);
                            console.log(param);
                            match = param.process(test[0]);
                            console.log(match);
                            error = false;
                        }
                        catch (e) {
                            error = e;
                        }
                            console.log('Error : ', error);
                        assert(!error, 'No error creating new parameter');
                            console.log('Matches? ', test[1], match, test[1] === match);
                        assert.equal(test[1], match, 'Check that ' + test[0] + ' set ' + (test[1] ? 'matches' : 'does not match'));
                            console.log('Value : ', test[2], param.value, test[2] === param.value);
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
