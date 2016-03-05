import { EnumStringsTool } from '../index';
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
