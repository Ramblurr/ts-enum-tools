function EnumFlagsType(enumeration, prop) {
    var keys = {};
    var hash = Object.keys(enumeration).reduce(function (obj, k) {
        if (isNaN(k) && enumeration[k]) {
            obj[k] = enumeration[k];
        }
        keys[k] = k;
        return obj;
    }, {});
    var State = function (methods) {
        this.methods = methods;
    };
    Object.keys(hash).forEach(function (k) {
        Object.defineProperty(State.prototype, k, { get: function () {
                return ((this.methods.val & +hash[k]) === +hash[k]);
            } });
    });
    var Methods = function (val) {
        this.val = val;
        this.state = new State(this);
    };
    Methods.prototype.all = function (flags) {
        return ((this.val & +flags) === +flags);
    };
    Methods.prototype.any = function (flags) {
        return ((this.val & +flags) > 0);
    };
    Methods.prototype.toArray = function () {
        return Object.keys(hash).filter(function (k) {
            return ((this.val & +hash[k]) === +hash[k]);
        }.bind(this));
    };
    Methods.prototype.toString = function () {
        return Object.keys(hash).filter(function (k) {
            return ((this.val & +hash[k]) === +hash[k]);
        }.bind(this)).join(' | ');
    };
    var BindValue = function BindValue(val) {
        return new Methods((val != null) ? val : this);
    };
    BindValue.val = hash;
    BindValue.key = keys;
    BindValue.toArray = function () {
        var arr = [];
        Object.keys(hash).map(function (k) {
            arr.push({ key: k, val: hash[k] });
        });
    };
    if (prop) {
        Object.defineProperty(Number.prototype, prop, { get: BindValue });
    }
    return BindValue;
}
exports.EnumFlagsType = EnumFlagsType;
function EnumStringsType(enumeration, prop, validKeysFilter) {
    var hash = {};
    var keys = {};
    if (validKeysFilter) {
        Object.keys(enumeration).forEach(function (k) {
            if (validKeysFilter(k)) {
                hash[k] = enumeration[k];
                keys[k] = k;
            }
        });
    }
    else {
        Object.keys(enumeration).forEach(function (k) {
            hash[k] = enumeration[k];
            keys[k] = k;
        });
    }
    var State = function (methods) {
        this.methods = methods;
    };
    Object.keys(hash).forEach(function (k) {
        Object.defineProperty(State.prototype, k, { get: function () {
                return ((this.methods.str) === hash[k]);
            } });
    });
    var Methods = function (str) {
        this.str = str.toString();
        this.state = new State(this);
    };
    Methods.prototype.equals = function (str) {
        return (this.str === str);
    };
    Methods.prototype.toStringKey = function () {
        for (var k in hash) {
            if (hash[k] === this.str) {
                return k;
            }
        }
    };
    Methods.prototype.toStringVal = function () {
        return this.str;
    };
    var BindString = function (str) {
        return new Methods((str != null) ? str : this);
    };
    BindString.val = hash;
    BindString.key = keys;
    BindString.toArray = function () {
        return Object.keys(hash).map(function (k) {
            return { key: k, val: hash[k] };
        });
    };
    if (prop) {
        Object.defineProperty(String.prototype, prop, { get: BindString });
    }
    return BindString;
}
exports.EnumStringsType = EnumStringsType;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumFlagsType;
