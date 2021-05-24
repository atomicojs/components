export const RouterSwitch: import("atomico/types/dom").Atom<import("atomico").Props<{
    path: StringConstructor;
    transition: FunctionConstructor;
    data: {
        type: ObjectConstructor;
        event: {
            type: string;
        };
    };
}>, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
