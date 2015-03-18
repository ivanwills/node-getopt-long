
var Param = require('./lib/getopt-long-param.js');
var getoptLong = require('./lib/getopt-long.js');

var exports;
exports.get = getoptLong.get;
exports.configure = getoptLong.configure;
exports.options = getoptLong.options;
exports.param = Param.param;
