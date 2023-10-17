export declare const ShowDrag: import("atomico/types/dom").Atomico<{
    toggle: () => void;
    position: "bottom" | "left" | "right";
    msMinDrag: number;
    msMaxDrag: number;
    minSizeShow: number;
} & {
    ready?: boolean;
    show?: boolean;
    dragging?: boolean;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
