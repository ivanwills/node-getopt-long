/* global require */
var Param = require('../lib/getopt-long-param.js');

/**
 * @object: getoptLong
 * @param: config - array of argument configuration
 *
 * Object inspirecd by Perl's Getopt::Long library
 */
var getoptLong = function() {
    this.parameters = [];
    this.configure(arguments[0]);
};
// record the version with the object
getoptLong.prototype.version    = '0.0.1';
// ignore case of options as entered
getoptLong.prototype.ignoreCase = true;
// allow bundling of short arguments eg -v -e can be written as -ve
getoptLong.prototype.bundle     = true;

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.configure = function(parameters) {

    for (var i in parameters) {
        if (parameters.hasOwnProperty(i)) {
            var parameter = parameters[i];
            var options = parameter[1] instanceof Object ? parameter[1] : { description: parameter[1] };
            options.parent = this;
            var param = new Param.param(parameter[0], options);
            this.parameters.push(param);
        }
    }

    return this;
};

var exports;
exports.get = getoptLong;
exports.configure = function () {
    return new getoptLong(arguments[0]);
};
