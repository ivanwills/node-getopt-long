/* global require */

var _ = require('underscore');

function strSplit(str, match, limit) {
    var split    = str.split(match);
    var newSplit = [];
    var i        = 0;

    while (i < limit - 1) {
        newSplit.push(split.shift());
        i++;
    }
    newSplit.push(split.join(match));
    return newSplit;
}

var getoptLongParam = function (details) {
    this.test     = [];
    this.possible = [];
    this.short    = [];
    this.setNames(details[0]);

    this.parent      = details[1].parent;
    this.description = details[1].description;
    this.on          = details[1].on;
    if (details[1].test) {
        this.test.push(details[1].test);
    }
    if (details[1].paramName) {
        this.paramName = details[1].paramName;
    }
};
getoptLongParam.prototype.VERSION   = '0.2.5';
getoptLongParam.prototype.name      = '';
getoptLongParam.prototype.value     = null;
getoptLongParam.prototype.paramName = null;
getoptLongParam.prototype.negatable = false;
getoptLongParam.prototype.increment = false;
getoptLongParam.prototype.parameter = false;
getoptLongParam.prototype.autoNo    = false;

getoptLongParam.prototype.arrayTest = function (values, value) {
    for (var i = 0; i < values.length; i++) {
        if (values[i] === value) {
            return value;
        }
    }

    throw '--' + this.name + ' must be one of ' + values.join(', ') + '\n';
};

var testInt = function (value, key, parent, self) {
    if ('' + value === '' + parseInt(value, 10)) {
        return parseInt(value, 10);
    }
    else {
        throw '--' + self.name + ' must be an integer\n';
    }
};
var testFloat = function (value, key, parent, self) {
    if ('' + value === '' + parseFloat(value)) {
        return parseFloat(value);
    }
    else {
        throw '--' + self.name + ' must be an number\n';
    }
};

getoptLongParam.prototype.setNames = function (spec) {
    var parts = spec.split(/(?=[!+=])/);
    var names = parts[0].split(/[|]/);

    this.name     = names[0];
    this.possible = names;
    this.short    = [];

    if (parts[1] === '!') {
        this.negatable = true;
    }
    else if (parts[1] === '+') {
        if (parts[2] === '+') {
            this.parameter = true;
            this.autoNo    = true;
            this.paramName = 'int';

            this.test.push(testInt);
        }
        else {
            this.increment = true;
        }
    }
    else if (parts[1] && parts[1].substr(0, 1) === '=') {
        this.setValueParam(parts);
    }

    _.each(names, function (name) {
        if (name.length === 1) {
            this.short.push(name);
        }
    }.bind(this));
};

getoptLongParam.prototype.setValueParam = function (parts) {
    this.parameter = true;
    var type = parts[1].substr(1);

    if (type && type.substr(0, 1) === 'i') {
        this.test.push(testInt);
        type = type.substr(1);
        this.paramName = 'int';
    }
    else if (type && (type.substr(0, 1) === 'd' || type.substr(0, 1) === 'f')) {
        this.test.push(testFloat);
        type = type.substr(1);
        this.paramName = 'float';
    }
    else {
        this.paramName = 'string';
        type = type.length === 2 ? type.substr(1) : type;
    }

    if (type) {
        if (type === '@') {
            this.list  = true;
            this.value = [];
        }
        else if (type === '%') {
            this.object = true;
            this.value  = {};
        }
    }
};

getoptLongParam.prototype.process = function (arg1, arg2) {
    var value;
    var key;
    var possibleMatch = function (name) {
        if (this.parameter && arg1.match(/=/)) {
            return '--' + name === arg1.split(/=/, 2)[0];
        }
        return '--' + name === arg1;
    }.bind(this);
    var shortMatch = function (name) {
        return '-' + name === arg1.substr(0, 2);
    };

    var long = this.possible.reduce(function (prev, cur) {
        if (possibleMatch(cur)) {
            prev.push(cur);
        }
        return prev;
    }, []).length;
    var short = this.short.reduce(function (prev, cur) {
        if (shortMatch(cur)) {
            prev.push(cur);
        }
        return prev;
    }, []).length;
    var auto  = this.autoNo ? arg1.match(/^-(\d+)$/) : false;

    if (long || short || auto) {
        var count = 1;
        if (this.increment) {
            this.value = this.value ? this.value + 1 : 1;
        }
        else if (this.parameter) {
            var valCount = this.extractValue(key, value, short, auto, arg1, arg2);
            value = valCount[0];
            if (valCount.length === 2) {
                count = valCount[1];
            }

            if (this.object) {
                var keyVal = strSplit(value, '=', 2);
                key = keyVal[0];
                value = keyVal[1];
            }

            this.runTests(key, value);

            this.setValue(key, value);
        }
        else {
            this.value = true;
        }

        if (short && !this.parameter && arg1.length > 2) {
            // flag that the bundled parameter should be removed
            count = -1;
        }

        if (this.on) {
            this.on(value, key, this.parent, this);
        }

        return count;
    }
    else if (this.negatable &&
        this.possible.reduce(function (prev, cur) {
            if ('--no-' + cur === arg1) {
                prev.push(cur);
            }
            return prev;
        }, []).length
    ) {
        this.value = false;

        if (this.on) {
            this.on(value, key, this.parent, this);
        }

        return 1;
    }

    return 0;
};

getoptLongParam.prototype.extractValue = function (key, value, short, auto, arg1, arg2) {
    if (auto) {
        return [auto[1]];
    }
    else if (arg1.match(/=/)) {
        return [strSplit(arg1, '=', 2)[1]];
    }
    else if (short && arg1.length > 2) {
        return [arg1.substr(2)];
    }
    else if (arg2 !== undefined) {
        return [arg2, 2];
    }

    throw '--' + this.name + ' requires a value\n';
};

getoptLongParam.prototype.setValue = function (key, value) {
    if (this.list) {
        this.value.push(value);
    }
    else if (this.object) {
        this.value[key] = value;
    }
    else {
        this.value = value;
    }
};

getoptLongParam.prototype.runTests = function (key, value) {
    // run any value tests
    for (var j in this.test) {
        if (this.test[j] instanceof Function) {
            value = this.test[j](value, key, this.parent, this);
        }
        else if (this.test[j] instanceof Array) {
            value = this.arrayTest(this.test[j], value);
        }
    }
};

getoptLongParam.prototype.help = function () {
    var help = this.short.length ? '  -' + this.short[0] : '    ';

    var last = this.possible.length - 1;
    while (this.possible[last] && this.possible[last].length === 1) {
        last--;
    }
    if (this.possible[last]) {
        help = help + ' --' + this.possible[last];
    }

    if (this.parameter) {
        help = help + '[=]' + this.paramName;
    }

    if (help.length >= 16) {
        help = help + '\n                ';
    }
    else {
        while (help.length < 16) {
            help = help + ' ';
        }
    }

    return help + this.description + '\n';
};

var exports;
exports.param = getoptLongParam;
