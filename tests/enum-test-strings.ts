/* global describe it */
declare var require: any;
declare var describe: any;
declare var it: any;

var should = require('should');
var assert = require('assert');
var mocha = require('mocha');

import { EnumStringsType, EnumStringsTool } from '../index';

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
var abStrFunc = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrProp");

// The tools function includes getters of type string, when map is provided
assert(abStrFunc.key.Clone === "Clone");             // Returns key
assert(abStrFunc.val.Clone === "clone");             // Returns value

var abStrFiltered = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrFiltered", function(k) {
  return (k != k.toLowerCase()); 
});

// Tools function works on enum types
var abStrEnum: AbStrings = AbStrings.Clone;

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

describe('EnumStringsType: Native string binding', function() {
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
