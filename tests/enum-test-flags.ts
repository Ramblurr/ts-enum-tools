/* global describe it */
declare var require: any;
declare var describe: any;
declare var it: any;

var should = require('should');
var assert = require('assert');
var mocha = require('mocha');

import { EnumFlagsType, EnumFlagsTool } from '../index';

// Declare a TypeScript enum
export enum AbFlags {
  None          = 0,
  isSelectable  = 1 << 1,
  isMovable     = 1 << 27,
  isEditable    = 1 << 28,
  isSortable    = 1 << 30,
  isClonable    = 1 << 31   // maximum!
}

// Create a map for number output
export interface AbFlagsMap {
  None:           boolean;
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
assert(abFlgFunc(abFlgEnum).all(AbFlags.isClonable) === true);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isMovable) === false);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgFunc(abFlgEnum).all(AbFlags.isMovable | AbFlags.isSortable) === false);
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
assert(abFlgVal.abFlgProp.all(AbFlags.isClonable) === true);
assert(abFlgVal.abFlgProp.all(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.all(AbFlags.isClonable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.all(AbFlags.isMovable | AbFlags.isSortable) === false);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable | AbFlags.isSortable) === true);
assert(abFlgVal.abFlgProp.any(AbFlags.isMovable) === false);
assert(abFlgVal.abFlgProp.toArray().length === 2);
assert(abFlgVal.abFlgProp.toString().indexOf("isSortable") + 1);
assert(abFlgVal.abFlgProp.toString().indexOf("isClonable") + 1);

describe('EnumFlagsType: Native number binding', function() {
  describe('Native flags: ' + abFlgVal.abFlgProp.toArray().join(", "), function() {
    it('should allow cloning', function() {
      should(abFlgVal.abFlgProp.all(AbFlags.isClonable)).equal(true);
    });
    it('should prevent moving', function() {
      should(abFlgVal.abFlgProp.all(AbFlags.isMovable)).equal(false);
    });
    it('should allow sorting', function() {
      should(abFlgVal.abFlgProp.all(AbFlags.isSortable)).equal(true);
    });
    it('should have property of isClonable that is true', function() {
      should(abFlgVal.abFlgProp.state.isClonable).equal(true);
    });
    it('should have property of isMovable that is false', function() {
      should(abFlgVal.abFlgProp.state.isMovable).equal(false);
    });
    it('should list (2) set flags', function() {
      should(abFlgVal.abFlgProp.toArray().length).equal(2);
    });
    it('should ouput a string', function() {
      should(abFlgVal.abFlgProp.toString()).containEql("isClonable");
      should(abFlgVal.abFlgProp.toString()).containEql("isSortable");
    });

    it('should maintain closure integrity when re-used', function() {
      // Adding another enum using the factory method
      var AbCheck = EnumFlagsType<AbFlagsChecked, typeof AbFlagsChecked>(AbFlagsChecked, "abChecked");
      var abValCheck: number = AbFlagsChecked.isGood
      should(AbCheck(abValCheck).state.isGood).equal(true);
      
      // Double checking original enum integrity
      should(abFlgVal.abFlgProp.all(AbFlags.isClonable)).equal(true);
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

    let iterationsFunc = 2500000;
    it(`should perform very well using function methods [${iterationsFunc}]`, function() {
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
        // A function is resuseable, so it is very fast
        let toolsPerInteration = abFlgFunc(variousFlagValues[x]);
        flag = toolsPerInteration.all(AbFlags.isClonable);
        flag = toolsPerInteration.any(AbFlags.isClonable);
        flag = toolsPerInteration.state.isClonable;
        x = (++x < 10) ? x : 0;
      }
    });

    let iterationsAll = 1000000;
    it(`should perform reasonably well using prototype all [${iterationsAll}]`, function() {
      let flag = false;
      for (let i = 0; i < iterationsAll; i++) {
        flag = abFlgVal.abFlgProp.all(AbFlags.isClonable);
      }
      should(flag).equal(true);
    });

    let iterationsAny = 1000000;
    it(`should perform reasonably well using prototype any [${iterationsAny}]`, function() {
      let flag = false;
      for (let i = 0; i < iterationsAny; i++) {
        flag = abFlgVal.abFlgProp.any(AbFlags.isSortable) || abFlgVal.abFlgProp.all(AbFlags.isMovable);
      }
      should(flag).equal(true);
    });

    let iterationsMap = 1000000;
    it(`should perform reasonably well using prototype map [${iterationsMap}]`, function() {
      let flag = false;
      for (let i = 0; i < iterationsMap; i++) {
        flag = !!abFlgVal.abFlgProp.state.isClonable;
      }
      should(flag).equal(true);
    });
  });
});
