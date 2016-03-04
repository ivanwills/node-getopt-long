/* global require, process */
var Param = require('../lib/getopt-long-param.js');
var _ = require('underscore');

var clone = function (obj) {
    var cloned = {};
    for (var i in obj) {
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
var getoptLong = function (params, config) {
    this.parameters = [];

    if (params) {
        if (config !== undefined) {
            _.each(config, function (value, key) {
                this[key] = value;
            }.bind(this));
        }

        this.configure(params);
    }
};

// record the version with the object
getoptLong.prototype.VERSION    = '0.2.5';
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
// used for flagging the --version value
getoptLong.prototype.commandVersion = null;
// remove extra parameters before passing options
getoptLong.prototype.extraCommandArgs = 2;
// default option values
getoptLong.prototype.defaults = {};
// alternate argument list
getoptLong.prototype.argv = null;

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.configure = function (parameters) {
    var self = this;

    for (var i in parameters) {
        if (parameters.hasOwnProperty(i)) {
            var parameter = parameters[i];
            var options = typeof parameter[1] === 'object' ? clone(parameter[1]) : { description: parameter[1] };
            options.parent = this;
            var param = new Param.param([parameter[0], options]);
            this.parameters.push(param);
        }
    }

    // Extra default parameters
    // --help
    this.parameters.push(
        new Param.param([
            'help',
            {
                parent     : this,
                description: 'Show this help message',
                on         : function () {
                    process.stdout.write(self.help());
                    process.exit(1);
                }
            }
        ])
    );

    // --version if this.commandVersion set
    if (this.commandVersion) {
        this.parameters.push(
            new Param.param([
                'version',
                {
                    parent: this,
                    description: 'Show the version of this command',
                    on: function() {
                        process.stdout.write(this.name + ' version ' + this.commandVersion + '\n');
                        process.exit(0);
                    }.bind(this)
                }
            ])
        );
    }

    return this;
};

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.process = function () {
    var params = _.clone(this.defaults),
        extra = [],
        type = this.argv !== null ? 'local' : 'process',
        argv = this.argv !== null ? this.argv : process.argv;

    for (var j = 0; j < this.extraCommandArgs; j++) {
        extra.push(argv.shift());
    }

    try {
        while (argv.length) {
            // store all non argument parameters in extra array
            if (!argv[0].match(/^-/)) {
                extra.push(argv.shift());
                continue;
            }

            // check if we find argument terminator
            if (argv[0] === '--') {
                argv.shift();
                extra.push.apply(extra, argv);
                // stop processing
                break;
            }

            var matched = false;
            for (var i = 0; i < this.parameters.length; i++) {
                var param = this.parameters[i];
                var match = param.process.apply(param, argv);
                if (!match) {
                    // skip non matching parameters
                    continue;
                }

                params[ param.name ] = param.value;
                if (match > 1) {
                    argv.shift();
                    argv.shift();
                    matched = true;
                }
                else if (match < 0) {
                    argv[0] = argv[0].replace(/^-./, '-');
                    matched = true;
                }
                else {
                    argv.shift();
                    matched = true;
                }

                i = this.parameters.length;
            }

            this._matched(matched, argv[0]);
        }
    }
    catch (error) {
        process.stderr.write(error);
        process.stdout.write(this.help());
        process.exit(2);
    }

    if (type === 'local') {
        this.argv = extra;
    }
    else {
        process.argv = extra;
    }

    return params;
};

/**
 * @param matched (bool) Truth of found parameters match
 *
 * Throws error if param has not matched its definition
 */
getoptLong.prototype._matched = function (matched, param) {
    if (!matched) {
        throw 'Unknown argument ' + param + '\n';
    }
};

/**
 * @param parameters (Array) list of parameter objects
 *
 * configures the accepted command line parameters
 */
getoptLong.prototype.help = function () {
    var help = '  ' + (this.name ? this.name : process.argv[1]) + '\n';

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
exports.configure = function (params, config) {
    return new getoptLong(params, config);
};
exports.options = function (params, config) {
    return new getoptLong(params, config).process();
};
