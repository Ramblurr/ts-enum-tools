/* global describe it after module assert should require */

declare var require: any;
declare var assert: any;

declare var it: any;
declare var should: any;
declare var describe: any;
declare var after: any;

var should = require('should');
var assert = require('assert');

import { EnumFlagsType, EnumFlagsTool, EnumStringsType, EnumStringsTool } from '../index';

function Timer() {
  return {
    start: new Date().getTime(),
    elapsed: function () { return new Date().getTime() - this.start }
  }
}

function PadValue(value, length) { 
  var padded = " " + value;
  return (padded.length <= length) ? PadValue(padded, length) : padded;
}

var Stats = { };


////////////////////////////////////////////////////////////
// Strings

// Declare a TypeScript enum
export enum AbStrings {
  None      = <any> "none",
  Select    = <any> "sel",
  Move      = <any> "mov",
  Edit      = <any> "edit",
  Sort      = <any> "sort",
  Clone     = <any> "clone"
}

// Create a map for string output and comparison
export interface AbStringsMap {
    None:   any;
    Select: any;
    Move:   any;
    Edit:   any;
    Sort:   any;
    Clone:  any;
}

// Declare a secondary closure validation enum
export enum AbStringsChecked {
  Good      = <any> "good",
  Better    = <any> "better",
}

// Method 1: Get function that accepts a String and returns a set of tools
// Filter asserts that valid keys are capitalized
var abStrFunc = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrProp", function(k) {
  return (k != k.toLowerCase()); 
});

// The tools function includes getters of type string, when map is provided
assert(abStrFunc.key.Clone === "Clone");             // Returns key
assert(abStrFunc.val.Clone === "clone");             // Returns value

// Tools function works on enum types
var abStrEnum: AbStrings = AbStrings.Clone;

// console.log(abStrFunc(abStrEnum).equals(AbStrings.Move));

assert(abStrFunc(abStrEnum).state.Clone);
assert(!abStrFunc(abStrEnum).state.Select);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrFunc(abStrEnum).equals(AbStrings.Move));
assert(abStrFunc(abStrEnum).toStringKey() === "Clone");
assert(abStrFunc(abStrEnum).toStringVal() === "clone");

// Method 2: Add Interface that extends a Number with a tools property
export interface AbString extends String {
  abStrProp?: EnumStringsTool<AbStrings, AbStringsMap>;
}

// Tools properties are then accessible on extended string types
var abStrVal: AbString = abStrFunc.val.Clone;

assert(abStrVal.abStrProp.state.Clone === true);
assert(!abStrVal.abStrProp.state.Move);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrVal.abStrProp.equals(AbStrings.Move));
assert(abStrVal.abStrProp.toStringKey() === "Clone");
assert(abStrVal.abStrProp.toStringVal() === "clone");

describe('EnumStringsType: Various tests', function() {
  describe('Native strings: ' + abStrVal.abStrProp.toString(), function() {
    it('should clone', function() {
      should(abStrVal.abStrProp.equals(AbStrings.Clone)).equal(true);
    });
    it('should not move', function() {
      should(abStrVal.abStrProp.equals(AbStrings.Move)).equal(false);
    });
    it('should not sort', function() {
      should(abStrVal.abStrProp.equals(AbStrings.Sort)).equal(false);
    });
    
    it('should maintain closure integrity when re-used', function() {
      // Adding another enum using the factory method
      var AbCheck = EnumStringsType<AbStringsChecked, typeof AbStringsChecked>(AbStringsChecked, "abStringCheck");
      var abValCheck: number = AbStringsChecked.Good
      should(AbCheck(abValCheck).state.Good).equal(true);
      
      // Double checking original enum integrity
      should(abStrVal.abStrProp.equals(AbStrings.Clone)).equal(true);
      should(abStrVal.abStrProp.state.Clone).equal(true);
      should(abStrVal.abStrProp.equals(AbStrings.Move)).equal(false);
      should(abStrVal.abStrProp.state.Move).equal(false);
    });
        
    it('should have property of Clone that is true', function() {
      should(abStrVal.abStrProp.state.Clone).equal(true);
    });
    it('should have property of Move that is false', function() {
      should(abStrVal.abStrProp.state.Move).equal(false);
    });
    it('should ouput a string', function() {
      should(abStrVal.abStrProp.toStringKey()).equal("Clone");
    });
  });
});


////////////////////////////////////////////////////////////
// Flags

// Declare a TypeScript enum
export enum AbFlags {
  isNone        = 0,
  isMovable     = 1 << 2,
  isSelectable  = 1 << 3,
  isEditable    = 1 << 28,
  isSortable    = 1 << 30,
  isClonable    = 1 << 31,   // maximum!
  isSelectSort  = isSelectable | isSortable   // example combo flag
}

// Create a map for number output
export interface AbFlagsMap {
  isNone:         boolean;
  isSelectable:   boolean;
  isMovable:      boolean;
  isEditable:     boolean;
  isSortable:     boolean;
  isClonable:     boolean;      
}

// Declare a secondary closure validation enum
export enum AbFlagsChecked {
  None          = 0,
  isGood        = 1 << 2,
  isBetter      = 1 << 4,
}

// Method 1: Get function that accepts a Number and returns a set of tools
var abFlgFunc = EnumFlagsType<AbFlags, AbFlagsMap>(AbFlags, "abFlgProp");

// Tools function works on enum | number types
var abFlgEnum: AbFlags = AbFlags.isClonable | AbFlags.isSortable;

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

// Method 2: Add Interface that extends a Number with a tools property
export interface AbNumber extends Number {
  abFlgProp?: EnumFlagsTool<AbFlags, AbFlagsMap>;
}

// Tools properties are available on extended number types
var abFlgVal: AbNumber = AbFlags.isClonable | AbFlags.isSortable;

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

describe('EnumFlagsType: Various tests', function() {
  this.timeout(0);
  describe('Native flags: ' + abFlgVal.abFlgProp.toArray().join(", "), function() {
    it('should handle case val(1000) > has(1000):t  any(1000):t  eql(1000):t  state[1000]:t  state[0100]:f ', function() {
      let val = (1 << 3);
      should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(true);
      should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(true);
      should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(true);
      should(abFlgFunc(val).state.isSelectable).equal(true);
      should(abFlgFunc(val).state.isMovable).equal(false);
    });
    it('should handle case val(1100) > has(1100):t  any(1100):t  eql(1100):t  state[1000]:t  state[0100]:t ', function() {
      let val = ((1 << 3) | (1 << 2));
      should(abFlgFunc(val).has(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).any(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).eql(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).state.isSelectable).equal(true);
      should(abFlgFunc(val).state.isMovable).equal(true);
    });
    it('should handle case val(0100) > has(1000):f  any(1000):f  eql(1000):f  state[1000]:f  state[0100]:t ', function() {
      let val = (1 << 2);
      should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).state.isSelectable).equal(false);
      should(abFlgFunc(val).state.isMovable).equal(true);
    });
    it('should handle case val(1100) > has(0100):t  any(0100):t  eql(0100):f  state[1000]:t  state[0100]:t ', function() {
      let val = ((1 << 3) | (1 << 2));
      should(abFlgFunc(val).has(AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).any(AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).eql(AbFlags.isMovable)).equal(false);
      should(abFlgFunc(val).state.isSelectable).equal(true);
      should(abFlgFunc(val).state.isMovable).equal(true);
    });
    it('should handle case val(0100) > has(1100):f  any(1100):t  eql(1100):f  state[1000]:f  state[0100]:t ', function() {
      let val = (1 << 2);
      should(abFlgFunc(val).has(AbFlags.isSelectable | AbFlags.isMovable)).equal(false);
      should(abFlgFunc(val).any(AbFlags.isSelectable | AbFlags.isMovable)).equal(true);
      should(abFlgFunc(val).eql(AbFlags.isSelectable | AbFlags.isMovable)).equal(false);
      should(abFlgFunc(val).state.isSelectable).equal(false);
      should(abFlgFunc(val).state.isMovable).equal(true);
    });
    it('should handle case val(0000) > has(1000):f  any(1000):t  eql(1000):f  state[1000]:f  state[0100]:f ', function() {
      let val = (0);
      should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).state.isSelectable).equal(false);
      should(abFlgFunc(val).state.isMovable).equal(false);
    });
    it('should handle case val(0000) > has(0000):t  any(0000):f  eql(0000):t  state[0000]:t  state[0100]:f ', function() {
      let val = (0);
      should(abFlgFunc(val).has(0)).equal(true);
      should(abFlgFunc(val).any(0)).equal(false);
      should(abFlgFunc(val).eql(0)).equal(true);
      should(abFlgFunc(val).state.isNone).equal(true);
      should(abFlgFunc(val).state.isMovable).equal(false);
    });
    it('should handle invalid bit combinations in values and arguments', function() {
      let val = ((1 << 5) | (1 << 10));
      should(abFlgFunc(val).has(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).any(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).eql(AbFlags.isSelectable)).equal(false);
      should(abFlgFunc(val).has(val)).equal(true);
      should(abFlgFunc(val).any(val)).equal(true);
      should(abFlgFunc(val).eql(val)).equal(true);
    });    
    it('should support various flags', function() {
      should(abFlgVal.abFlgProp.has(AbFlags.isClonable)).equal(true);
      should(abFlgVal.abFlgProp.has(AbFlags.isMovable)).equal(false);
      should(abFlgVal.abFlgProp.has(AbFlags.isSortable)).equal(true);
    });
    it('should support various properties', function() {
      should(abFlgVal.abFlgProp.state.isClonable).equal(true);
      should(abFlgVal.abFlgProp.state.isMovable).equal(false);
    });
    it('should return an array consisting of (2) flags', function() {
      should(abFlgVal.abFlgProp.toArray().length).equal(2);
    });
    it('should ouput a string similar to: "isSortable | isClonable"', function() {
      should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
      should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
    });

    it('should maintain closure integrity and support re-use', function() {
      // Adding another enum using the factory method
      var AbCheck = EnumFlagsType<AbFlagsChecked, typeof AbFlagsChecked>(AbFlagsChecked, "abChecked");
      var abValCheck: number = AbFlagsChecked.isGood
      should(AbCheck(abValCheck).state.isGood).equal(true);
      
      // Double checking original enum integrity
      should(abFlgVal.abFlgProp.has(AbFlags.isClonable)).equal(true);
      should(abFlgVal.abFlgProp.state.isClonable).equal(true);
      should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
      should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
    });
    
    it('should be immutable value when using function methods', function() {
      var changingValue: AbNumber = 0;

      // function binds to value passed in, so it gets captured
      changingValue = AbFlags.isClonable | AbFlags.isSortable;
      var toolsImmutable = abFlgFunc(changingValue);
      should(toolsImmutable.state.isClonable).be.true;
      should(!toolsImmutable.state.isEditable).be.true;

      changingValue = AbFlags.isMovable | AbFlags.isEditable;
      should(toolsImmutable.state.isClonable).be.true;
      should(!toolsImmutable.state.isEditable).be.true;
    });

    it('should not be immutable value when using prototype properties', function() {
      var changingValue: AbNumber = 0;

      // prototype methods are created on the fly, so it acts on current value
      changingValue = AbFlags.isClonable | AbFlags.isSortable;
      should(changingValue.abFlgProp.state.isClonable).be.true;
      should(!changingValue.abFlgProp.state.isEditable).be.true;

      changingValue = AbFlags.isMovable | AbFlags.isEditable;
      should(changingValue.abFlgProp.state.isEditable).be.true;
      should(!changingValue.abFlgProp.state.isClonable).be.true;
    });

    let iterationsFunc = 1000000;
    it(`should perform function(value) tools over (${iterationsFunc}) iterations`, function() {
      let timer = Timer();
            
      let variousFlagValues = [
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
      ]

      let x = 0;
      let flag = false;
      for (let i = 0; i < iterationsFunc; i++) {
        // A function is resuseable, so it is typically faster when using repeatedly
        let toolsPerInteration = abFlgFunc(variousFlagValues[x]);
        flag = toolsPerInteration.has(AbFlags.isClonable);
        flag = toolsPerInteration.any(AbFlags.isClonable);
        flag = toolsPerInteration.state.isClonable;
        x = (++x < 10) ? x : 0;
      }
      
      Stats["func"] = timer.elapsed();
    });

    let iterationsAll = 1000000;
    it(`should perform using value.has property over (${iterationsAll}) iterations`, function() {
      let timer = Timer();

      let flag = false;
      for (let i = 0; i < iterationsAll; i++) {
        flag = abFlgVal.abFlgProp.has(AbFlags.isClonable);
      }
      should(flag).equal(true);

      Stats["prop"] = timer.elapsed();
    });

    let iterationsAny = 1000000;
    it(`should perform using value.any property over (${iterationsAny}) iterations`, function() {
      let flag = false;
      for (let i = 0; i < iterationsAny; i++) {
        flag = abFlgVal.abFlgProp.any(AbFlags.isSortable);
      }
      should(flag).equal(true);
    });

    let iterationsMap = 1000000;
    it(`should perform using value.state property over (${iterationsMap}) iterations`, function() {
      let flag = false;
      for (let i = 0; i < iterationsMap; i++) {
        flag = abFlgVal.abFlgProp.state.isClonable;
      }
      should(flag).equal(true);
    });
    
    var iterationTest = function(val) { 
      this.val = val; 
    };
    iterationTest.prototype.check = function(flag) { 
      return ((this.val & flag) === flag) 
    };
    
    let iterationsBase = 5000000;
    it(`inline logical compairison baseline (${iterationsBase}) iterations`, function() {
      let timer = Timer();
      
      let val1: any = AbFlags.isMovable | AbFlags.isSortable;
      let val2: any = AbFlags.isClonable | AbFlags.isSortable;
      let flag = false;
      for (let i = 0; i < iterationsBase; i++) {
        let testObject = new iterationTest(val1);
        flag = testObject.check(val2);
      }
      should(flag).equal(false);

      Stats["base"] = timer.elapsed();
    });
  });
  
  after(function() {
   console.log(`\n\n  Stats Func/Prop/Base:${PadValue(Stats["func"], 6)}${PadValue(Stats["prop"], 6)}${PadValue(Stats["base"], 6)}`);
  });
});

