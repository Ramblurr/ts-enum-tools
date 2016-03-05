var should = require('should');
var assert = require('assert');
var mocha = require('mocha');
var index_1 = require('../index');
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
console.log(abStrFunc(abStrEnum).equals(AbStrings.Move));
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
describe('EnumStringsType: Native string binding', function () {
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
