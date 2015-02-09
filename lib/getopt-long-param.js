
var getoptLongParam = function (details) {
    this.setNames(details[0]);
};
getoptLongParam.prototype.version   = '0.0.1';
getoptLongParam.prototype.name      = '';
getoptLongParam.prototype.possible  = [];
getoptLongParam.prototype.short     = [];
getoptLongParam.prototype.value     = null;
getoptLongParam.prototype.negatable = false;

getoptLongParam.prototype.setNames = function(spec) {
    var parts = spec.split(/(?=[!])/);
    var names = parts[0].split(/[|]/);
    this.name = names[0];
    this.possible = names;
    this.short    = [];

    if (parts[1] === '!') {
        this.negatable = true;
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
    if ( this.possible.reduce(function(prev, cur) { if ( '--' + cur === arg ) prev.push(cur); return prev; }, []).length
        || this.short.reduce(function(prev, cur) { if ( '-' + cur === arg ) prev.push(cur); return prev; }, []).length
    ) {
        this.value = true;
        return true;
    }

    return false;
};

var exports;
exports.param = getoptLongParam;
