/* global require, describe, it, assert, beforeEach */

var assert = require('assert');
var param = require('../lib/getopt-long-param.js');
console.log(param);

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

            for (var j in data['this']) {
                (function(test) {
                    it('sets ' + test[0], function() {
                        var opt = new param(data.args);
                        console.log(opt, opt[test[0]], test[1]);
                        assert.deepEqual(opt[test[0]], test[1], test[2]);
                    });
                })(data['this'][j]);
            }

//          for (var k in data.bad) {
//              (function(test) {
//                  it(test, function() {
//                        var error;
//                        try {
//                            opt.process(test.argv);
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
