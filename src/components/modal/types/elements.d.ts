export declare const Modal: import("atomico/types/dom").Atomico<{
    closed: () => void;
    open: () => void;
    toggle: () => void;
    padding: string;
    position: string;
    onChangeShow: (event: Event) => any;
} & {
    show?: boolean;
    showAfterMs?: number;
    fullSize?: boolean;
    lazyload?: boolean;
    fullSizeClosed?: boolean;
    inTransition?: boolean;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
