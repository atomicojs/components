export const RouterCase: import("atomico/types/dom").Atom<import("atomico").Props<{
    slot: {
        type: StringConstructor;
        reflect: boolean;
        value: string;
    };
    path: {
        type: StringConstructor;
        reflect: boolean;
        path: string;
    };
    for: {
        type: StringConstructor;
        reflect: boolean;
    };
    load: null;
}>, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
