import { EnumFlagsTool } from '../index';
export declare enum AbFlags {
    None = 0,
    isSelectable = 2,
    isMovable = 134217728,
    isEditable = 268435456,
    isSortable = 1073741824,
    isClonable = -2147483648,
}
export interface AbFlagsMap {
    None: boolean;
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
