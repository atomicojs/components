export declare const Modal: import("atomico/types/dom").Atomico<{
    showAfterMs?: number;
    show?: boolean;
    padding?: string;
    position?: string;
    fullSize?: boolean;
    lazyload?: boolean;
    fullSizeClosed?: boolean;
    inTransition?: boolean;
    onChangeShow?: (event: Event) => any;
    open?: () => void;
    closed?: () => void;
    toggle?: () => void;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
