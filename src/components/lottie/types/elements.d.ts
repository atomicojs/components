import { AnimationItem } from "lottie-web";
export declare const cdn: {
    url: string;
};
export declare const Lottie: import("atomico/types/dom").Atomico<{
    renderer: "svg" | "canvas" | "html";
    onLoaded: (event: Event) => any;
    onDataReady: (event: Event) => any;
    onComplete: (event: Event) => any;
    onLoopComplete: (event: Event) => any;
    onEnterFrame: (event: Event) => any;
    onSegmentStart: (event: Event) => any;
    onIntersection: (event: CustomEvent<IntersectionObserverEntry>) => any;
    onCreateAnimation: (event: Event) => any;
} & {
    path?: string;
    data?: import("atomico/types/schema").FillObject;
    autoplay?: boolean;
    loop?: boolean;
    animation?: AnimationItem;
    cdn?: boolean;
    lazyload?: boolean;
    intersection?: boolean;
    intersectionOffset?: string;
    intersectionThreshold?: number | number[];
    intersectionControl?: boolean;
    intersectionControlReplay?: boolean;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
