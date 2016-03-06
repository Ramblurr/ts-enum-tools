export interface EnumFlagsTool<E, e> {
    state: e;
    eql: (a: E) => boolean;
    has: (a: E) => boolean;
    any: (a: E) => boolean;
    toArray: () => string[];
    toString: () => string;
}
export interface EnumFlagsFunc<E, e> {
    (val?: any): EnumFlagsTool<E, e>;
    toArray: () => {
        key: string;
        val: number;
    }[];
    val: e;
    key: e;
}
export interface EnumStringsTool<E, e> {
    state: e;
    equals: (a: E) => boolean;
    toStringKey: () => string;
    toStringVal: () => string;
}
export interface EnumStringsFunc<E, e> {
    (str?: any): EnumStringsTool<E, e>;
    toArray: () => {
        key: string;
        val: string;
    }[];
    val: e;
    key: e;
}
export declare var EnumFlagsTest: {
    has: (val: any, flags: any) => boolean;
    any: (val: any, flags: any) => boolean;
    eql: (val: any, flags: any) => boolean;
};
export declare var EnumFlagsTestAlt: (val: any) => void;
export declare function EnumFlagsType<E, e>(enumeration: any, prop?: string): EnumFlagsFunc<E, e>;
export declare function EnumStringsType<E, e>(enumeration: any, prop?: string, validKeysFilter?: Function): EnumStringsFunc<E, e>;
