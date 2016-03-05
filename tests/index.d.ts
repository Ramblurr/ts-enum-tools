import { EnumFlagsTool, EnumStringsTool } from '../index';
export declare enum AbStrings {
    None,
    Select,
    Move,
    Edit,
    Sort,
    Clone,
}
export interface AbStringsMap {
    None: any;
    Select: any;
    Move: any;
    Edit: any;
    Sort: any;
    Clone: any;
}
export declare enum AbStringsChecked {
    Good,
    Better,
}
export interface AbString extends String {
    abStrProp?: EnumStringsTool<AbStrings, AbStringsMap>;
}
export declare enum AbFlags {
    isNone = 0,
    isMovable = 4,
    isSelectable = 8,
    isEditable = 268435456,
    isSortable = 1073741824,
    isClonable = -2147483648,
    isSelectSort = 1073741832,
}
export interface AbFlagsMap {
    isNone: boolean;
    isSelectable: boolean;
    isMovable: boolean;
    isEditable: boolean;
    isSortable: boolean;
    isClonable: boolean;
}
export declare enum AbFlagsChecked {
    None = 0,
    isGood = 4,
    isBetter = 16,
}
export interface AbNumber extends Number {
    abFlgProp?: EnumFlagsTool<AbFlags, AbFlagsMap>;
}
