
var getoptLongParam = function (details) {
    this.setNames(details[0]);

    if (details[1] instanceof String) {
        this.description = details[1];
    }
    else {
    }
};
getoptLongParam.prototype.version   = '0.0.1';
getoptLongParam.prototype.name      = '';
getoptLongParam.prototype.possible  = [];
getoptLongParam.prototype.short     = [];
getoptLongParam.prototype.value     = null;
getoptLongParam.prototype.negatable = false;
getoptLongParam.prototype.increment = false;
getoptLongParam.prototype.parameter = false;

getoptLongParam.prototype.setNames = function(spec) {
    var parts = spec.split(/(?=[!+=])/);
    var names = parts[0].split(/[|]/);
    this.name = names[0];
    this.possible = names;
    this.short    = [];

    if (parts[1] === '!') {
        this.negatable = true;
    }
    else if (parts[1] === '+') {
        this.increment = true;
    }
    else if (parts[1] && parts[1].substr(0,1) === '=') {
        this.parameter = true;
    }

    for ( var i in names ) {
        var name = names[i];
        if ( name.length === 1 ) {
            this.short.push(name);
        }
    }

    if (this.short.length === 0) {
        this.short.push(this.name.substr(0,1));
    }
};

getoptLongParam.prototype.process = function(arg) {
    var self = this;
    var possibleMatch = function(name) {
        if (self.parameter && arg.match(/=/)) {
            return '--' + name === arg.split(/=/, 2)[0];
        }
        return '--' + name === arg;
    };
    var shortMatch = function(name) {
        return '-' + name === arg;
    };

    if ( this.possible.reduce(function(prev, cur) { if (possibleMatch(cur)) prev.push(cur); return prev; }, []).length
        || this.short.reduce(function(prev, cur) { if (shortMatch(cur)) prev.push(cur); return prev; }, []).length
    ) {
        if (this.increment) {
            this.value = this.value ? this.value + 1 : 1;
        }
        else if (this.parameter) {
            if (arg.match(/=/)) {
                this.value = arg.split(/=/, 2)[1];
            }
            else if (arguments[1]) {
                this.value = arguments[1];
            }
            else {
                return false;
            }
        }
        else {
            this.value = true;
        }
        return true;
    }
    else if ( this.negatable
        && this.possible.reduce(function(prev, cur) { if ( '--no-' + cur === arg ) prev.push(cur); return prev; }, []).length
    ) {
        this.value = false;
        return true;
    }

    return false;
};

var exports;
exports.param = getoptLongParam;
