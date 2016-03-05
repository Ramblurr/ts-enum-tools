var should = require('should');
var assert = require('assert');
var mocha = require('mocha');
var index_1 = require('../index');
(function (AbFlags) {
    AbFlags[AbFlags["None"] = 0] = "None";
    AbFlags[AbFlags["isSelectable"] = 2] = "isSelectable";
    AbFlags[AbFlags["isMovable"] = 134217728] = "isMovable";
    AbFlags[AbFlags["isEditable"] = 268435456] = "isEditable";
    AbFlags[AbFlags["isSortable"] = 1073741824] = "isSortable";
    AbFlags[AbFlags["isClonable"] = -2147483648] = "isClonable";
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
assert(abFlgFunc(abFlgEnum).all(AbFlags.isClonable) === true);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isMovable) === false);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isMovable | AbFlags.isSortable) === false);
assert(abFlgFunc(abFlgEnum).any(AbFlags.isMovable) === false);
assert(abFlgFunc(abFlgEnum).toArray().length === 2);
assert(abFlgFunc(abFlgEnum).toString().indexOf("isSortable") + 1);
assert(abFlgFunc(abFlgEnum).toString().indexOf("isClonable") + 1);
var abFlgVal = AbFlags.isClonable | AbFlags.isSortable;
assert(abFlgVal.abFlgProp.state.isClonable);
assert(!abFlgVal.abFlgProp.state.isMovable);
assert(abFlgVal.abFlgProp.all(AbFlags.isClonable) === true);
assert(abFlgVal.abFlgProp.all(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.all(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.all(AbFlags.isMovable | AbFlags.isSortable) === false);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.toArray().length === 2);
assert(abFlgVal.abFlgProp.toString().indexOf("isSortable") + 1);
assert(abFlgVal.abFlgProp.toString().indexOf("isClonable") + 1);
describe('EnumFlagsType: Native number binding', function () {
    describe('Native flags: ' + abFlgVal.abFlgProp.toArray().join(", "), function () {
        it('should allow cloning', function () {
            should(abFlgVal.abFlgProp.all(AbFlags.isClonable)).equal(true);
        });
        it('should prevent moving', function () {
            should(abFlgVal.abFlgProp.all(AbFlags.isMovable)).equal(false);
        });
        it('should allow sorting', function () {
            should(abFlgVal.abFlgProp.all(AbFlags.isSortable)).equal(true);
        });
        it('should have property of isClonable that is true', function () {
            should(abFlgVal.abFlgProp.state.isClonable).equal(true);
        });
        it('should have property of isMovable that is false', function () {
            should(abFlgVal.abFlgProp.state.isMovable).equal(false);
        });
        it('should list (2) set flags', function () {
            should(abFlgVal.abFlgProp.toArray().length).equal(2);
        });
        it('should ouput a string', function () {
            should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
            should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
        });
        it('should maintain closure integrity when re-used', function () {
            var AbCheck = index_1.EnumFlagsType(AbFlagsChecked, "abChecked");
            var abValCheck = AbFlagsChecked.isGood;
            should(AbCheck(abValCheck).state.isGood).equal(true);
            should(abFlgVal.abFlgProp.all(AbFlags.isClonable)).equal(true);
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
        var iterationsFunc = 2500000;
        it("should perform very well using function methods [" + iterationsFunc + "]", function () {
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
                flag = toolsPerInteration.all(AbFlags.isClonable);
                flag = toolsPerInteration.any(AbFlags.isClonable);
                flag = toolsPerInteration.state.isClonable;
                x = (++x < 10) ? x : 0;
            }
        });
        var iterationsAll = 1000000;
        it("should perform reasonably well using prototype all [" + iterationsAll + "]", function () {
            var flag = false;
            for (var i = 0; i < iterationsAll; i++) {
                flag = abFlgVal.abFlgProp.all(AbFlags.isClonable);
            }
            should(flag).equal(true);
        });
        var iterationsAny = 1000000;
        it("should perform reasonably well using prototype any [" + iterationsAny + "]", function () {
            var flag = false;
            for (var i = 0; i < iterationsAny; i++) {
                flag = abFlgVal.abFlgProp.any(AbFlags.isSortable) || abFlgVal.abFlgProp.all(AbFlags.isMovable);
            }
            should(flag).equal(true);
        });
        var iterationsMap = 1000000;
        it("should perform reasonably well using prototype map [" + iterationsMap + "]", function () {
            var flag = false;
            for (var i = 0; i < iterationsMap; i++) {
                flag = !!abFlgVal.abFlgProp.state.isClonable;
            }
            should(flag).equal(true);
        });
    });
});
