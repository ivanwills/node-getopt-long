
/**
 * @object: getoptLong
 * @param: config - array of argument configuration
 *
 * Object inspirecd by Perl's Getopt::Long library
 */
var getoptLong = function() {
    if (arguments.length) {
        this.configure(arguments[0]);
    }
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

    return this;
};

var exports;
exports.get = new getoptLong();
exports.configure = function () {
    return new getoptLong(arguments[0]);
};
