
/** Interface describing the tools for flag enums */
export interface EnumFlagsTool<E, e> {
  state: e,  // Returns map of T/F values
  eql: (a: E) => boolean;
  has: (a: E) => boolean;
  any: (a: E) => boolean;
  toArray: () => string[];
  toString: () => string;
}

/** Static properties on the function returned by EnumFlagsType<E,e> */
export interface EnumFlagsFunc<E, e> {
  (val?): EnumFlagsTool<E, e>,
  toArray: () => { key: string, val: number }[];
  val: e,
  key: e,
}

/** Interface describing the tools for string enums */
export interface EnumStringsTool<E, e> {
  state: e,  // Returns map of T/F values
  equals: (a: E) => boolean;
  toStringKey: () => string;
  toStringVal: () => string;
}

/** Static properties on the function returned by EnumStringsType<E,e> */
export interface EnumStringsFunc<E, e> {
  (str?): EnumStringsTool<E, e>,
  toArray: () => { key: string, val: string }[];
  val: e,
  key: e,
}

/**
 * Fastest methods are these simple no frills comparison tests.
 */
export var EnumFlagsTest = {
  has: function(val, flags) {
    return ((+val & +flags) === +flags);
  },
  any: function(val, flags) {
    return !!(+val & +flags);
  },
  eql: function(val, flags) {
    return (+val === +flags);
  }
}

/**
 * This alternative using prototype method may be faster - WTH ?
 */
export var EnumFlagsTestAlt = function(val) {
  this.val = val;
};
EnumFlagsTestAlt.prototype.has = function(flags) {
  return ((+this.val & +flags) === +flags)
};


/**
 * Returns a tools assortment for flag enums, and optionally implements them as a property of
 * Number.prototype (named getter). The tools automatically bind to each unique Number.
 */
export function EnumFlagsType<E, e>(enumeration, prop?: string): EnumFlagsFunc<E, e> {

  var keys = {};  
  var hash = Object.keys(enumeration).reduce(function(obj, k) {
    // Excludes bi-directional numeric keys
    if (isNaN(<any>k)) {
      obj[k] = +enumeration[k];
    }
    keys[k] = k;
    return obj;
  }, {});

  // New instance created per each binding
  var State = function(methods) {
    this.methods = methods
  };
  Object.keys(hash).forEach(function(k) {
    Object.defineProperty(State.prototype, k, { get: function() {
      return !!hash[k] ? ((this.methods.val & hash[k]) === hash[k]) : !this.methods.val;
    }});
  });

  // New instance created per each binding
  var Methods = function(val) {
    this.val = +val;
    this.state = new State(this);
  };
  Methods.prototype.eql = function(flags) {
    return (this.val === +flags);
  };
  Methods.prototype.has = function(flags) {
    return (+(this.val & +flags) === +flags);
  };
  Methods.prototype.any = function(flags) {
    return !!(this.val & +flags);
  };
  Methods.prototype.toArray = function() {
    return Object.keys(hash).filter(function(k) {
      return !!hash[k] && ((this.val & hash[k]) === hash[k]); // all bits weed out combos
    }.bind(this));
  };
  Methods.prototype.toString = function() {
    return Object.keys(hash).filter(function(k) {
      return !!hash[k] && ((this.val & hash[k]) === hash[k]);
    }.bind(this)).join(' | ');
  };

  // This either runs in the context of a primitive or a value must be provided
  var BindValue: any = function BindValue(val?: number): EnumFlagsTool<E, e> {
    return new Methods((val === undefined) ? this : val);
  };

  BindValue.val = hash;
  BindValue.key = keys;
  BindValue.toArray = function() {
    let arr = [];
    Object.keys(hash).map(function(k) {
      arr.push({ key: k, val: hash[k] });
    });
  };

  // If property name is given, a number prototype is set
  if (prop) {
    Object.defineProperty(Number.prototype, prop, { get: BindValue });
  }

  return BindValue;
}

/**
 * Returns a tools assortment for string enums, and optionally implements them as a property of
 * String.prototype (named getter). The tools automatically bind to each unique string.
 */
export function EnumStringsType<E, e>(enumeration, prop?: string, validKeysFilter?: Function): EnumStringsFunc<E, e> {

  var hash = {};
  var keys = {};
  if (validKeysFilter) {
    Object.keys(enumeration).forEach(function(k) {
      if (validKeysFilter(k)) {
        hash[k] = enumeration[k];
        keys[k] = k;
      }
    });
  } else {
    Object.keys(enumeration).forEach(function(k) {
      hash[k] = enumeration[k];
      keys[k] = k;
    });
  }    
    
  // New instance created per each binding
  var State = function(methods) {
    this.methods = methods
  };
  Object.keys(hash).forEach(function(k) {
    Object.defineProperty(State.prototype, k, { get: function() {
      return (this.methods.str === hash[k]);
    }});
  });

  // New instance created per each binding
  var Methods = function(str) {
    this.str = str.toString();
    this.state = new State(this);
  };
  Methods.prototype.equals = function(str) {
    return (this.str === str);
  };
  Methods.prototype.toStringKey = function() {
    for(var k in hash) {
      if(hash[k] === this.str) { 
        return k; 
      }
    }   
  };
  Methods.prototype.toStringVal = function() {
    return this.str;
  };
  
  // This either runs in the context of a primitive or a string must be provided
  var BindString: any = function (str?: string): EnumStringsTool<E, e> {
    return new Methods((str === undefined) ? this : str);
  };
  
  BindString.val = hash;
  BindString.key = keys;
  BindString.toArray = function() {
    return Object.keys(hash).map(function(k) {
      return { key: k, val: hash[k] };
    });
  };

  // If property name is given, a string prototype is set
  if (prop) {
    Object.defineProperty(String.prototype, prop, { get: BindString });
  }

  return BindString;
}
