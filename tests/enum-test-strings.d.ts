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
    None: string;
    Select: string;
    Move: string;
    Edit: string;
    Sort: string;
    Clone: string;
}
export declare enum AbStringsChecked {
    Good,
    Better,
}
export interface AbString extends String {
    abStrProp?: EnumStringsTool<AbStrings, AbStringsMap>;
}
