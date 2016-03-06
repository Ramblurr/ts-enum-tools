TypeScript Enum Tools
==

The TypeScript enum can lend powerful intellisense capabilities, but a few additional things are 
needed to use them in many situations. These tools help deal with situations where either flag 
or string enums are necessary.  

### Installation and use

Install the and module and save it to package.json. 

```
npm install ts-enum-tools --save
```

Import the type of functionality needed, depending on whether an enum is a type of flag or string. 

```
import { EnumStringsType, EnumStringsTool } from 'ts-enum-tools';
import { EnumFlagsType, EnumFlagsTool } from 'ts-enum-tools';
```

## Flags Type Enums

Declare a TypeScript enum beginning with unique 32 bit numbers composed of a single bit. 
Combination flags can then be added, using a logical OR (i.e. isSelectable | isSortable).
It's also advisable to declare an inteface mirroring the enum, that better describes the 
boolean output provided by some of the tools.

```
// Declare a TypeScript enum using bit values
export enum AbFlags {
  None          = 0,
  isSelectable  = 1 << 1,
  isMovable     = 1 << 27,
  isEditable    = 1 << 28,
  isSortable    = 1 << 30,
  isClonable    = 1 << 31,   // maximum!
  isSelectSort  = isSelectable | isSortable   // example combo flag
}

// Create a map for boolean output (recommended)
export interface AbFlagsMap {
  None:           boolean;
  isSelectable:   boolean;
  isMovable:      boolean;
  isEditable:     boolean;
  isSortable:     boolean;
  isClonable:     boolean;         
  isSelectSort:   boolean;
}
```
Enum flag tests can be accomplished in 3 ways. The first and most obvious method is to utilize
raw test functions that have been proofed in order to reliably compare values. The enums can also 
be extended by generating wrapper function that produces a set of tools, and the wrapper factory
can optionally set a property getter for the tools on the built-in Number primitive prototype.


#### Flag testing with raw test functions

The fastest methods are these simple no-frills functions. But they don't convey very much.
The alternatives below are more informative in many situations where flags or strings are used.

```
export var EnumFlagsTest = {
  has: function(val, flags) { return ((+val & +flags) === +flags); },
  any: function(val, flags) { return !!(+val & +flags); },
  eql: function(val, flags) { return (+val === +flags); }
}
```

#### Wrapping the enum for extended functionality

There are 3 ways to obtain a function that wraps an enum and binds to a integer value, 
thereby adding some tools with additional capabilities beyond those shown above. 

The most basic means of obtaining a tools function is to call the EnumFlagsType (factory method)
with a basic enum type. 

```
var abFlgFunc = EnumFlagsType<AbFlags, typeof AbFlags>(AbFlags);
```

Replacing the generic typeof enum shown above with an additional interface that 
describes the values of an enum as boolean, will enhance the tools intellisense output.

```
var abFlgFunc = EnumFlagsType<AbFlags, AbFlagsMap>(AbFlags);
```

If a property name is also provided, then it's used to assign the same tools to the 
Number.prototype.prop (warning: this may be illegal in some cultures). 

```
var abFlgFunc = EnumFlagsType<AbFlags, AbFlagsMap>(AbFlags, "abFlgProp");
```

All of the above variations return a function that can be used to bind a value and return
a set of tools which are valid for that specific value. 


#### Flag tests using the wrapper function's methods

The tools function can be put to work on ordinary number types. These are slower than the
raw methods shown first, but they are much fastest than the getters that will be shown next.

```
// Tools function works on enum | number types.
var abFlgEnum: AbFlags = AbFlags.isClonable | AbFlags.isSortable;

truthy(abFlgFunc(abFlgEnum).state.isClonable);
falsey(abFlgFunc(abFlgEnum).state.isMovable);

truthy(abFlgFunc(abFlgEnum).has(AbFlags.isClonable));
falsey(abFlgFunc(abFlgEnum).has(AbFlags.isMovable));

truthy(abFlgFunc(abFlgEnum).has(AbFlags.isClonable | AbFlags.isSortable));
falsey(abFlgFunc(abFlgEnum).has(AbFlags.isMovable | AbFlags.isSortable));

truthy(abFlgFunc(abFlgEnum).any(AbFlags.isMovable | AbFlags.isSortable));
truthy(abFlgFunc(abFlgEnum).any(AbFlags.isClonable));
falsey(abFlgFunc(abFlgEnum).any(AbFlags.isMovable));

truthy(abFlgFunc(abFlgEnum).eql(AbFlags.isClonable | AbFlags.isSortable));
falsey(abFlgFunc(abFlgEnum).eql(AbFlags.isClonable));
falsey(abFlgFunc(abFlgEnum).eql(AbFlags.isMovable));

truthy(abFlgFunc(abFlgEnum).toArray().length === 2);
truthy(abFlgFunc(abFlgEnum).toString().indexOf("isSortable") + 1);
```

#### Flag tests using Number.prototype getter methods 

For pure convenience (when the data set is not large), the getters are easier to use. 
The methods are only assigned to the number prototype if a property name is provided. 

To access the extension through intellisense, you must add your own interface describing it. 
Note that the name of the property should match the string provided to the EnumType factory
earlier, which in this case is "abFlgProp".

```
// Interface extends a Number primitive with a tools property
export interface AbNumber extends Number {
  abFlgProp?: EnumFlagsTool<AbFlags, AbFlagsMap>;
}

// Tools properties are limited to extended number types by TS
var abFlgVal: AbNumber = AbFlags.isClonable | AbFlags.isSortable;

truthy(abFlgVal.abFlgProp.state.isClonable);
falsey(abFlgVal.abFlgProp.state.isMovable);

truthy(abFlgVal.abFlgProp.has(AbFlags.isClonable));
falsey(abFlgVal.abFlgProp.has(AbFlags.isMovable));

truthy(abFlgVal.abFlgProp.has(AbFlags.isClonable | AbFlags.isSortable));
falsey(abFlgVal.abFlgProp.has(AbFlags.isMovable | AbFlags.isSortable));

truthy(abFlgVal.abFlgProp.any(AbFlags.isMovable | AbFlags.isSortable));
truthy(abFlgVal.abFlgProp.any(AbFlags.isClonable));
falsey(abFlgVal.abFlgProp.any(AbFlags.isMovable));

truthy(abFlgVal.abFlgProp.eql(AbFlags.isClonable | AbFlags.isSortable));
falsey(abFlgVal.abFlgProp.eql(AbFlags.isClonable));
falsey(abFlgVal.abFlgProp.eql(AbFlags.isMovable));

truthy(abFlgVal.abFlgProp.toArray().length === 2);
truthy(abFlgVal.abFlgProp.toString().indexOf("isSortable") + 1);
```

For additional information on performance and comparisons, 
see the [Test results for flags](#test-results-for-flags) far below. 



## String Type Enums

Declare a TypeScript enum using string values. Since these are not officialy supported
in TypeScript yet, it is necessary to cast them as a type of 'any'. It's also advisable 
to declare an inteface mirroring the enum, that better describes the string or boolean 
output provided by some of the tools.

```
// Declare a TypeScript enum using unique string values
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
```

Get function that accepts a String and returns a set of tools. The same variations that are available on 
number enum types also apply to string types.

```
var abStrFunc = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrProp");
```

The tools function includes getters for **key** and **val** that are typed as string. This helps reduce the  
need to cast the enum to a string.

```
assert(abStrFunc.key.Clone === "Clone");
assert(abStrFunc.val.Clone === "clone");
```

#### Value testing with returned function's methods

The tools function can be put to work on ordinary string types. 

```
// Tools function works on enum | number types
var abStrEnum: AbStrings = AbStrings.Clone;

truthy(abStrFunc(abStrEnum).state.Clone);
falsey(abStrFunc(abStrEnum).state.Select);
truthy(abStrFunc(abStrEnum).equals(AbStrings.Clone));
falsey(abStrFunc(abStrEnum).equals(AbStrings.Move));
truthy(abStrFunc(abStrEnum).toStringKey() === "Clone");
truthy(abStrFunc(abStrEnum).toStringVal() === "clone");
```

#### Value testing with String.prototype.prop's methods 

As previously mentioned, the getters are easier to use, but they may be slower. 
The methods are only assigned to the number prototype if a property name is provided. 

```
// Add Interface that extends a Number with a tools property
export interface AbString extends String {
  abStrProp?: EnumStringsTool<AbStrings, AbStringsMap>;
}

// Tools properties are then accessible on extended string types
var abStrVal: AbString = abStrFunc.str.Clone;

truthy(abStrVal.abStrProp.state.Clone === true);
falsey(abStrVal.abStrProp.state.Move);
truthy(abStrFunc(abStrEnum).equals(AbStrings.Clone));
falsey(abStrVal.abStrProp.equals(AbStrings.Move));
truthy(abStrVal.abStrProp.toStringKey() === "Clone");
truthy(abStrVal.abStrProp.toStringVal() === "clone");
```

#### Filtering string enum keys 

It may be beneficial to restrict the values that are recognized as keys. An optional filter function
may be provided to do so. The function receives each potential key and returns T/F to indicate inclusion.

```
// Filter asserts that valid keys are capitalized 
var abStrFiltered = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrFiltered", 
                                                  function(k) { return (k != k.toLowerCase()); });
  
console.log(abStrFiltered.toArray());

[ 
  { key: 'None',    val: 'none' },
  { key: 'Select',  val: 'sel' },
  { key: 'Move',    val: 'mov' },
  { key: 'Edit',    val: 'edit' },
  { key: 'Sort',    val: 'sort' },
  { key: 'Clone',   val: 'clone' } 
]
```

## Test results for flags

The following output give an idea of the performance of the flag tests. The tools function is 
considerably faster than the tools prototype methods. This should be taken into consideration when 
the amount of data being processed is significant.

All times are reported in milliseconds:

```
          functions   properties     baseline (raw)
 Nodejs          71          352           60
 Chrome          82          408           76  
 FireFox         50          580           58  
 IE            1537          840         1500  
```

The output of the tests give an idea how different flag combination scenarios are handled.

```

 EnumStringsType: Various tests
   √ should clone
   √ should not move
   √ should not sort
   √ should maintain closure integrity when re-used
   √ should have property of Clone that is true
   √ should have property of Move that is false
   √ should ouput a string

 EnumFlagsType: Various tests
   √ should handle case val(1000) > has(1000):t  any(1000):t  eql(1000):t  state[1000]:t  state[0100]:f
   √ should handle case val(1100) > has(1100):t  any(1100):t  eql(1100):t  state[1000]:t  state[0100]:t
   √ should handle case val(0100) > has(1000):f  any(1000):f  eql(1000):f  state[1000]:f  state[0100]:t
   √ should handle case val(1100) > has(0100):t  any(0100):t  eql(0100):f  state[1000]:t  state[0100]:t
   √ should handle case val(0100) > has(1100):f  any(1100):t  eql(1100):f  state[1000]:f  state[0100]:t
   √ should handle case val(0000) > has(1000):f  any(1000):t  eql(1000):f  state[1000]:f  state[0100]:f
   √ should handle case val(0000) > has(0000):t  any(0000):f  eql(0000):t  state[0000]:t  state[0100]:f
   √ should handle invalid bit combinations in values and arguments
   √ should support various flags
   √ should support various properties
   √ should return an array consisting of (2) flags
   √ should ouput a string similar to: "isSortable | isClonable"
   √ should maintain closure integrity and support re-use
   √ should be immutable value when using function methods
   √ should not be immutable value when using prototype properties
   √ should perform function(value) tools over (1000000) iterations (85ms)
   √ should perform using value.has property over (1000000) iterations (293ms)
   √ should perform using value.any property over (1000000) iterations (295ms)
   √ should perform using value.state property over (1000000) iterations (328ms)
   √ inline logical operation comparison baseline (5000000) iterations (60ms)


 27 passing (1s)

```