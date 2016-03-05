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

Declare a TypeScript enum and an interface that describes the values as a unique 32 bit number.

```
// Declare a TypeScript enum using bit values
export enum AbFlags {
  None          = 0,
  isSelectable  = 1 << 1,
  isMovable     = 1 << 27,
  isEditable    = 1 << 28,
  isSortable    = 1 << 30,
  isClonable    = 1 << 31   // maximum!
}

// Create a map for boolean output (recommended)
export interface AbFlagsMap {
  None:           boolean;
  isSelectable:   boolean;
  isMovable:      boolean;
  isEditable:     boolean;
  isSortable:     boolean;
  isClonable:     boolean;         
}
```

Generate a function that returns tools when given a number. The tools function 
is obtained by calling the EnumFlagsType (factory method). 

```
import { EnumFlagsType, EnumFlagsTool } from "ts-enum-tools";

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
assert(abFlgFunc(abFlgEnum).toList().length === 2);
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
assert(abFlgVal.abFlgProp.toList().length === 2);
assert(abFlgVal.abFlgProp.toString().indexOf("isSortable") + 1);
assert(abFlgVal.abFlgProp.toString().indexOf("isClonable") + 1);
```


### String Type Enums

Declare a TypeScript enum and an interface that describes the values as a string.

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

// Create a map for string output (recommended)
export interface AbStringsMap {
    None:   string;
    Select: string;
    Move:   string;
    Edit:   string;
    Sort:   string;
    Clone:  string;      
}
```

Get function that accepts a Number and returns a set of tools. The same variations that are available on 
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

#### Filtering strign enum keys 

It may be beneficial to restrict the values that are recognized as keys. An optional filter function
may be provided to do so.

```
// Filter asserts that valid keys are capitalized 
var abStrFiltered = EnumStringsType<AbStrings, AbStringsMap>(AbStrings, "abStrFiltered", function(k) {
  return (k != k.toLowerCase());  
});
console.log(abStrFiltered.toArray());

[ 
  { key: 'None', val: 'none' },
  { key: 'Select', val: 'sel' },
  { key: 'Move', val: 'mov' },
  { key: 'Edit', val: 'edit' },
  { key: 'Sort', val: 'sort' },
  { key: 'Clone', val: 'clone' } 
]
```
