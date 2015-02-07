
var getoptLongParam = function (details) {
    this.setNames(details[0]);
};
getoptLongParam.prototype.version = '0.0.1';

getoptLongParam.prototype.setNames = fuction(spec) {
    var names = spec.split(/[|]/);
    this.name = names[0];
    this.possible = names;
    this.short    = [];

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

var exports;
exports.param = getoptLongParam;
