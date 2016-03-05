var should = require('should');
var assert = require('assert');
var index_1 = require('../index');
function Timer() {
    return {
        start: new Date().getTime(),
        elapsed: function () { return new Date().getTime() - this.start; }
    };
}
function PadValue(value, length) {
    var padded = " " + value;
    return (padded.length <= length) ? PadValue(padded, length) : padded;
}
var Stats = {};
(function (AbStrings) {
    AbStrings[AbStrings["None"] = "none"] = "None";
    AbStrings[AbStrings["Select"] = "sel"] = "Select";
    AbStrings[AbStrings["Move"] = "mov"] = "Move";
    AbStrings[AbStrings["Edit"] = "edit"] = "Edit";
    AbStrings[AbStrings["Sort"] = "sort"] = "Sort";
    AbStrings[AbStrings["Clone"] = "clone"] = "Clone";
})(exports.AbStrings || (exports.AbStrings = {}));
var AbStrings = exports.AbStrings;
(function (AbStringsChecked) {
    AbStringsChecked[AbStringsChecked["Good"] = "good"] = "Good";
    AbStringsChecked[AbStringsChecked["Better"] = "better"] = "Better";
})(exports.AbStringsChecked || (exports.AbStringsChecked = {}));
var AbStringsChecked = exports.AbStringsChecked;
var abStrFunc = index_1.EnumStringsType(AbStrings, "abStrProp", function (k) {
    return (k != k.toLowerCase());
});
assert(abStrFunc.key.Clone === "Clone");
assert(abStrFunc.val.Clone === "clone");
var abStrEnum = AbStrings.Clone;
assert(abStrFunc(abStrEnum).state.Clone);
assert(!abStrFunc(abStrEnum).state.Select);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrFunc(abStrEnum).equals(AbStrings.Move));
assert(abStrFunc(abStrEnum).toStringKey() === "Clone");
assert(abStrFunc(abStrEnum).toStringVal() === "clone");
var abStrVal = abStrFunc.val.Clone;
assert(abStrVal.abStrProp.state.Clone === true);
assert(!abStrVal.abStrProp.state.Move);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrVal.abStrProp.equals(AbStrings.Move));
assert(abStrVal.abStrProp.toStringKey() === "Clone");
assert(abStrVal.abStrProp.toStringVal() === "clone");
describe('EnumStringsType: Various tests', function () {
    describe('Native strings: ' + abStrVal.abStrProp.toString(), function () {
        it('should clone', function () {
            should(abStrVal.abStrProp.equals(AbStrings.Clone)).equal(true);
        });
        it('should not move', function () {
            should(abStrVal.abStrProp.equals(AbStrings.Move)).equal(false);
        });
        it('should not sort', function () {
            should(abStrVal.abStrProp.equals(AbStrings.Sort)).equal(false);
        });
        it('should maintain closure integrity when re-used', function () {
            var AbCheck = index_1.EnumStringsType(AbStringsChecked, "abStringCheck");
            var abValCheck = AbStringsChecked.Good;
            should(AbCheck(abValCheck).state.Good).equal(true);
            should(abStrVal.abStrProp.equals(AbStrings.Clone)).equal(true);
            should(abStrVal.abStrProp.state.Clone).equal(true);
            should(abStrVal.abStrProp.equals(AbStrings.Move)).equal(false);
            should(abStrVal.abStrProp.state.Move).equal(false);
        });
        it('should have property of Clone that is true', function () {
            should(abStrVal.abStrProp.state.Clone).equal(true);
        });
        it('should have property of Move that is false', function () {
            should(abStrVal.abStrProp.state.Move).equal(false);
        });
        it('should ouput a string', function () {
            should(abStrVal.abStrProp.toStringKey()).equal("Clone");
        });
    });
});
(function (AbFlags) {
    AbFlags[AbFlags["isNone"] = 0] = "isNone";
    AbFlags[AbFlags["isMovable"] = 4] = "isMovable";
    AbFlags[AbFlags["isSelectable"] = 8] = "isSelectable";
    AbFlags[AbFlags["isEditable"] = 268435456] = "isEditable";
    AbFlags[AbFlags["isSortable"] = 1073741824] = "isSortable";
    AbFlags[AbFlags["isClonable"] = -2147483648] = "isClonable";
    AbFlags[AbFlags["isSelectSort"] = 1073741832] = "isSelectSort";
})(exports.AbFlags || (exports.AbFlags = {}));
var AbFlags = exports.AbFlags;
(function (AbFlagsChecked) {
    AbFlagsChecked[AbFlagsChecked["None"] = 0] = "None";
    AbFlagsChecked[AbFlagsChecked["isGood"] = 4] = "isGood";
    AbFlagsChecked[AbFlagsChecked["isBetter"] = 16] = "isBetter";
})(exports.AbFlagsChecked || (exports.AbFlagsChecked = {}));
var AbFlagsChecked = exports.AbFlagsChecked;
var abFlgFunc = index_1.EnumFlagsType(AbFlags, "abFlgProp");
var abFlgEnum = AbFlags.isClonable | AbFlags.isSortable;
assert(abFlgFunc(abFlgEnum).state.isClonable);
assert(!abFlgFunc(abFlgEnum).state.isMovable);
assert(abFlgFunc(abFlgEnum).has(AbFlags.isClonable) === true);
assert(abFlgFunc(abFlgEnum).has(AbFlags.isMovable) === false);
assert(abFlgFunc(abFlgEnum).has(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgFunc(abFlgEnum).has(AbFlags.isMovable | AbFlags.isSortable) === false);
assert(abFlgFunc(abFlgEnum).any(AbFlags.isMovable) === false);
assert(abFlgFunc(abFlgEnum).toArray().length === 2);
assert(abFlgFunc(abFlgEnum).toString().indexOf("isSortable") + 1);
assert(abFlgFunc(abFlgEnum).toString().indexOf("isClonable") + 1);
var abFlgVal = AbFlags.isClonable | AbFlags.isSortable;
assert(abFlgVal.abFlgProp.state.isClonable);
assert(!abFlgVal.abFlgProp.state.isMovable);
assert(abFlgVal.abFlgProp.has(AbFlags.isClonable) === true);
assert(abFlgVal.abFlgProp.has(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.has(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.has(AbFlags.isMovable | AbFlags.isSortable) === false);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.toArray().length === 2);
assert(abFlgVal.abFlgProp.toString().indexOf("isSortable") + 1);
assert(abFlgVal.abFlgProp.toString().indexOf("isClonable") + 1);
describe('EnumFlagsType: Various tests', function () {
    this.timeout(0);
    describe('Native flags: ' + abFlgVal.abFlgProp.toArray().join(", "), function () {
        it('should handle case val(1000) > has(1000):t  any(1000):t  eql(1000):t  state[1000]:t  state[0100]:f ', function () {
            var val = (1 << 3);
            should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(true);
            should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(true);
            should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(true);
            should(abFlgFunc(val).state.isSelectable).equal(true);
            should(abFlgFunc(val).state.isMovable).equal(false);
        });
        it('should handle case val(1100) > has(1100):t  any(1100):t  eql(1100):t  state[1000]:t  state[0100]:t ', function () {
            var val = ((1 << 3) | (1 << 2));
            should(abFlgFunc(val).has(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).any(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).eql(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).state.isSelectable).equal(true);
            should(abFlgFunc(val).state.isMovable).equal(true);
        });
        it('should handle case val(0100) > has(1000):f  any(1000):f  eql(1000):f  state[1000]:f  state[0100]:t ', function () {
            var val = (1 << 2);
            should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).state.isSelectable).equal(false);
            should(abFlgFunc(val).state.isMovable).equal(true);
        });
        it('should handle case val(1100) > has(0100):t  any(0100):t  eql(0100):f  state[1000]:t  state[0100]:t ', function () {
            var val = ((1 << 3) | (1 << 2));
            should(abFlgFunc(val).has(AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).any(AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).eql(AbFlags.isMovable)).equal(false);
            should(abFlgFunc(val).state.isSelectable).equal(true);
            should(abFlgFunc(val).state.isMovable).equal(true);
        });
        it('should handle case val(0100) > has(1100):f  any(1100):t  eql(1100):f  state[1000]:f  state[0100]:t ', function () {
            var val = (1 << 2);
            should(abFlgFunc(val).has(AbFlags.isSelectable | AbFlags.isMovable)).equal(false);
            should(abFlgFunc(val).any(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
            should(abFlgFunc(val).eql(AbFlags.isSelectable | AbFlags.isMovable)).equal(false);
            should(abFlgFunc(val).state.isSelectable).equal(false);
            should(abFlgFunc(val).state.isMovable).equal(true);
        });
        it('should handle case val(0000) > has(1000):f  any(1000):t  eql(1000):f  state[1000]:f  state[0100]:f ', function () {
            var val = (0);
            should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).state.isSelectable).equal(false);
            should(abFlgFunc(val).state.isMovable).equal(false);
        });
        it('should handle case val(0000) > has(0000):t  any(0000):f  eql(0000):t  state[0000]:t  state[0100]:f ', function () {
            var val = (0);
            should(abFlgFunc(val).has(0)).equal(true);
            should(abFlgFunc(val).any(0)).equal(false);
            should(abFlgFunc(val).eql(0)).equal(true);
            should(abFlgFunc(val).state.isNone).equal(true);
            should(abFlgFunc(val).state.isMovable).equal(false);
        });
        it('should handle invalid bit combinations in values and arguments', function () {
            var val = ((1 << 5) | (1 << 10));
            should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
            should(abFlgFunc(val).has(val)).equal(true);
            should(abFlgFunc(val).any(val)).equal(true);
            should(abFlgFunc(val).eql(val)).equal(true);
        });
        it('should support various flags', function () {
            should(abFlgVal.abFlgProp.has(AbFlags.isClonable)).equal(true);
            should(abFlgVal.abFlgProp.has(AbFlags.isMovable)).equal(false);
            should(abFlgVal.abFlgProp.has(AbFlags.isSortable)).equal(true);
        });
        it('should support various properties', function () {
            should(abFlgVal.abFlgProp.state.isClonable).equal(true);
            should(abFlgVal.abFlgProp.state.isMovable).equal(false);
        });
        it('should return an array consisting of (2) flags', function () {
            should(abFlgVal.abFlgProp.toArray().length).equal(2);
        });
        it('should ouput a string similar to: "isSortable | isClonable"', function () {
            should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
            should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
        });
        it('should maintain closure integrity and support re-use', function () {
            var AbCheck = index_1.EnumFlagsType(AbFlagsChecked, "abChecked");
            var abValCheck = AbFlagsChecked.isGood;
            should(AbCheck(abValCheck).state.isGood).equal(true);
            should(abFlgVal.abFlgProp.has(AbFlags.isClonable)).equal(true);
            should(abFlgVal.abFlgProp.state.isClonable).equal(true);
            should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
            should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
        });
        it('should be immutable value when using function methods', function () {
            var changingValue = 0;
            changingValue = AbFlags.isClonable | AbFlags.isSortable;
            var toolsImmutable = abFlgFunc(changingValue);
            should(toolsImmutable.state.isClonable).be.true;
            should(!toolsImmutable.state.isEditable).be.true;
            changingValue = AbFlags.isMovable | AbFlags.isEditable;
            should(toolsImmutable.state.isClonable).be.true;
            should(!toolsImmutable.state.isEditable).be.true;
        });
        it('should not be immutable value when using prototype properties', function () {
            var changingValue = 0;
            changingValue = AbFlags.isClonable | AbFlags.isSortable;
            should(changingValue.abFlgProp.state.isClonable).be.true;
            should(!changingValue.abFlgProp.state.isEditable).be.true;
            changingValue = AbFlags.isMovable | AbFlags.isEditable;
            should(changingValue.abFlgProp.state.isEditable).be.true;
            should(!changingValue.abFlgProp.state.isClonable).be.true;
        });
        var iterationsFunc = 1000000;
        it("should perform function(value) tools over (" + iterationsFunc + ") iterations", function () {
            var timer = Timer();
            var variousFlagValues = [
                AbFlags.isSelectable,
                AbFlags.isMovable,
                AbFlags.isEditable,
                AbFlags.isSortable,
                AbFlags.isClonable,
                AbFlags.isSelectable | AbFlags.isClonable,
                AbFlags.isEditable | AbFlags.isMovable,
                AbFlags.isSortable | AbFlags.isClonable,
                AbFlags.isSelectable | AbFlags.isClonable | AbFlags.isEditable,
                AbFlags.isClonable | AbFlags.isMovable | AbFlags.isEditable | AbFlags.isSelectable
            ];
            var x = 0;
            var flag = false;
            for (var i = 0; i < iterationsFunc; i++) {
                var toolsPerInteration = abFlgFunc(variousFlagValues[x]);
                flag = toolsPerInteration.has(AbFlags.isClonable);
                flag = toolsPerInteration.any(AbFlags.isClonable);
                flag = toolsPerInteration.state.isClonable;
                x = (++x < 10) ? x : 0;
            }
            Stats["func"] = timer.elapsed();
        });
        var iterationsAll = 1000000;
        it("should perform using value.has property over (" + iterationsAll + ") iterations", function () {
            var timer = Timer();
            var flag = false;
            for (var i = 0; i < iterationsAll; i++) {
                flag = abFlgVal.abFlgProp.has(AbFlags.isClonable);
            }
            should(flag).equal(true);
            Stats["prop"] = timer.elapsed();
        });
        var iterationsAny = 1000000;
        it("should perform using value.any property over (" + iterationsAny + ") iterations", function () {
            var flag = false;
            for (var i = 0; i < iterationsAny; i++) {
                flag = abFlgVal.abFlgProp.any(AbFlags.isSortable);
            }
            should(flag).equal(true);
        });
        var iterationsMap = 1000000;
        it("should perform using value.state property over (" + iterationsMap + ") iterations", function () {
            var flag = false;
            for (var i = 0; i < iterationsMap; i++) {
                flag = abFlgVal.abFlgProp.state.isClonable;
            }
            should(flag).equal(true);
        });
        var iterationTest = function (val) {
            this.val = val;
        };
        iterationTest.prototype.check = function (flag) {
            return ((this.val & flag) === flag);
        };
        var iterationsBase = 5000000;
        it("inline logical compairison baseline (" + iterationsBase + ") iterations", function () {
            var timer = Timer();
            var val1 = AbFlags.isMovable | AbFlags.isSortable;
            var val2 = AbFlags.isClonable | AbFlags.isSortable;
            var flag = false;
            for (var i = 0; i < iterationsBase; i++) {
                var testObject = new iterationTest(val1);
                flag = testObject.check(val2);
            }
            should(flag).equal(false);
            Stats["base"] = timer.elapsed();
        });
    });
    after(function () {
        console.log("\n\n  Stats Func/Prop/Base:" + PadValue(Stats["func"], 6) + PadValue(Stats["prop"], 6) + PadValue(Stats["base"], 6));
    });
});
