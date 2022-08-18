export declare class CPXCookie extends HTMLElement {
    static get tag(): string;
    worker: Worker;
    ready: boolean;
    _debug: boolean;
    get debug(): boolean;
    set debug(val: boolean);
    _cookie: string;
    get cookie(): string;
    set cookie(val: string);
    _action: any;
    get action(): any;
    set action(val: any);
    _parse: any;
    get parse(): any;
    set parse(val: any);
    _emit: string;
    get emit(): string;
    set emit(val: string);
    _key: string;
    get key(): string;
    set key(val: string);
    _value: string;
    get value(): string;
    set value(val: string);
    constructor();
    connectedCallback(): void;
}
