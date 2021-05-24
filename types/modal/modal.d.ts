export const Modal: import("atomico/types/dom").Atom<import("atomico").Props<{
    showAfterMs: NumberConstructor;
    show: {
        type: BooleanConstructor;
        reflect: boolean;
    };
    padding: {
        type: StringConstructor;
        value: string;
    };
    position: {
        type: StringConstructor;
        value: string;
    };
    fullSize: {
        type: BooleanConstructor;
        reflect: boolean;
    };
    fullSizeClosed: BooleanConstructor;
}>, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
