export declare const ShowDrag: import("atomico/types/dom").Atomico<{
    show?: boolean;
    dragging?: boolean;
    position?: "bottom" | "left" | "right";
    ready?: boolean;
    msMinDrag?: number;
    msMaxDrag?: number;
    minSizeShow?: number;
    toggle?: () => void;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
