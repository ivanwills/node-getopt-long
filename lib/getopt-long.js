/* global require, process */
var Param = require('../lib/getopt-long-param.js');

var clone = function(obj) {
    var cloned = {};
    for ( var i in obj ) {
        if (obj.hasOwnProperty(i)) {
            cloned[i] = obj[i];
        }
    }
    return cloned;
};

/**
 * @object: getoptLong
 * @param: config - array of argument configuration
 *
 * Object inspirecd by Perl's Getopt::Long library
 */
var getoptLong = function() {
    this.parameters = [];
    if (arguments.length) {
        this.configure(arguments[0]);
        if (arguments[1] !== undefined) {
            for (var i in arguments[1]) {
                if (arguments[1].hasOwnProperty(i)) {
                    this[i] = arguments[1][i];
                }
            }
        }
    }
};

// record the version with the object
getoptLong.prototype.version    = '0.0.1';
// ignore case of options as entered
getoptLong.prototype.ignoreCase = true;
// allow bundling of short arguments eg -v -e can be written as -ve
getoptLong.prototype.bundle     = true;
// use this as the script's name
getoptLong.prototype.name       = null;
// append this text to the end of help
getoptLong.prototype.helpSuffix = null;
// append this text before options
getoptLong.prototype.helpPrefix = null;

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.configure = function(parameters) {

    for (var i in parameters) {
        if (parameters.hasOwnProperty(i)) {
            var parameter = parameters[i];
            var options = typeof parameter[1] === 'object' ? clone(parameter[1]) : { description: parameter[1] };
            options.parent = this;
            var param = new Param.param([parameter[0], options]);
            this.parameters.push(param);
        }
    }

    return this;
};

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.process = function() {
    var params = {}, extra = [process.argv.shift(), process.argv.shift()];

    while (process.argv.length) {
        // store all non argument parameters in extra array
        if (!process.argv[0].match(/^-/)) {
            extra.push(process.argv.shift());
            continue;
        }
        if (process.argv[0] === '--') {
            process.argv.shift();
            extra.push.apply(extra, process.argv);
            break;
        }

        var matched = false;
        for (var i in this.parameters) {
            var param = this.parameters[i];
            var match = param.process.apply(param, process.argv);
            if (!match) {
                // skip non matching parameters
                continue;
            }

            params[ param.name ] = param.value;
            if (match > 1) {
                process.argv.shift();
                process.argv.shift();
                matched = true;
                break;
            }
            else if (match < 0) {
                process.argv[0] = process.argv[0].replace(/^-./, '-');
                matched = true;
                break;
            }

            process.argv.shift();
            matched = true;
            break;
        }
        if (!matched) {
            throw 'Unknown argument ' + process.argv[0] + '\n';
        }
    }

    process.argv = extra;
    return params;
};

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.help = function() {
    var help = '  ' + (this.name ? this.name : process.argv[1] ) + '\n';

    if (this.helpPrefix) {
        help = help + this.helpPrefix;
    }
    else {
        help = help + '\n';
    }

    help = help + ' Options:\n';

    for (var i in this.parameters) {
        if (typeof this.parameters[i].help === 'function') {
            help = help + this.parameters[i].help();
        }
    }

    if (this.helpSuffix) {
        help = help + '\n' + this.helpSuffix + '\n';
    }

    return help;
};

var exports;
exports.get = getoptLong;
exports.configure = function () {
    return new getoptLong(arguments[0], arguments[1]);
};
exports.options = function () {
    return new getoptLong(arguments[0], arguments[1]).process();
};
