export const SendForm: import("atomico/types/dom").Atom<import("atomico").Props<{
    response: null;
    action: StringConstructor;
    mode: StringConstructor;
    cache: StringConstructor;
    json: BooleanConstructor;
    headers: ObjectConstructor;
    method: {
        type: StringConstructor;
        value: string;
    };
    credentials: {
        type: StringConstructor;
        value: string;
    };
    status: {
        type: StringConstructor;
        reflect: boolean;
        event: {
            type: string;
            bubbles: boolean;
            composed: boolean;
        };
    };
}>, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
