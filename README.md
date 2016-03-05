TypeScript Enum Tools
==

The TypeScript enum can lend powerful intellisense capabilities, but they leave a few things to be 
desired with regard to flexibility. These tools help deal with situations where either flag or string 
enums are necessary.  

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

### Flags Type Enums

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

Generate a function that returns tools when given a number. The tools function 
is obtained by calling the EnumFlagsType (factory method). 

```
var abFlgFunc = EnumFlagsType<AbFlags, typeof AbFlags>(AbFlags);
```

Provide an additional interface that describes the values of the enum as 
boolean, and replace the line above as shown in order to enhance intellisense results.

```
var abFlgFunc = EnumFlagsType<AbFlags, AbFlagsMap>(AbFlags);
```

If a property name is provided, then it's used to assign tools to the Number.prototype.prop 
(warning: this may be illegal in some cultures). 

```
var abFlgFunc = EnumFlagsType<AbFlags, AbFlagsMap>(AbFlags, "abFlgProp");
```

All of the above variations return a function that can be used to bind a value and return
a set of tools which are valid for that specific value. Prototypes are used to reduce the 
overhead to a minimum.

#### Flag testing with returned function's methods

The tools function can be put to work on ordinary number types. These are by far the fastest
methods, because the getters shown next can add significant overhead.

```
// Tools function works on enum | number types.
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
```

#### Flag testing with Number.prototype.prop's methods 

For pure convenience (when the data set is not large), the getters are easier to use. 
The methods are only assigned to the number prototype if a property name is provided. 
Using a unique name for the property allows other enum types within your project.

To access the extension through intellisense, you must add your own interface describing it. 
Note that the name of the property should match the string provided to the EnumType factory
earlier, which in this case is "abFlgProp".

```
// Interface extends a Number with a tools property
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
```


### String Type Enums

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

assert(abStrFunc(abStrEnum).state.Clone);
assert(!abStrFunc(abStrEnum).state.Select);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrFunc(abStrEnum).equals(AbStrings.Move));
assert(abStrFunc(abStrEnum).toStringKey() === "Clone");
assert(abStrFunc(abStrEnum).toStringVal() === "clone");
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

assert(abStrVal.abStrProp.state.Clone);
assert(!abStrVal.abStrProp.state.Move);
assert(abStrFunc(abStrEnum).equals(AbStrings.Clone));
assert(!abStrVal.abStrProp.equals(AbStrings.Move));
assert(abStrVal.abStrProp.toStringKey() === "Clone");
assert(abStrVal.abStrProp.toStringVal() === "clone");
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

### Test results

The following output give an idea of the performance of the flag tests. The tools function is 
considerably faster than the tools prototype methods. This should be taken into consideration when 
the amount of data being processed is significant.

All times are reported in milliseconds:

```
          functions   properties     baseline
 Nodejs          71          352           21
 Chrome          82          408           22  
 FireFox         50          580           22  
 IE            1537          840         1985  
```

The output of the tests give an idea how different flag combination scenarios are handled.

```
  EnumStringsType: Various tests
    Native strings: [object Object]
      √ should clone
      √ should not move
      √ should not sort
      √ should maintain closure integrity when re-used
      √ should have property of Clone that is true
      √ should have property of Move that is false
      √ should ouput a string

  EnumFlagsType: Various tests
    Native flags: isSortable, isClonable
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
      √ should perform function(value) tools over (1000000) iterations (69ms)
      √ should perform using value.has property over (1000000) iterations (304ms)
      √ should perform using value.any property over (1000000) iterations (292ms)
      √ should perform using value.state property over (1000000) iterations (315ms)
      √ inline logical operation comparison baseline (5000000) iterations

  27 passing (1s)

```