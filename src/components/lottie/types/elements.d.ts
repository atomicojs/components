import { AnimationItem } from "lottie-web";
export declare const cdn: {
    url: string;
};
export declare const Lottie: import("atomico/types/dom").Atomico<{
    cdn?: boolean;
    path?: string;
    loop?: boolean;
    lazyload?: boolean;
    intersection?: boolean;
    intersectionOffset?: string;
    intersectionThreshold?: number | number[];
    intersectionControl?: boolean;
    intersectionControlReplay?: boolean;
    autoplay?: boolean;
    data?: unknown;
    animation?: AnimationItem;
    renderer?: "svg" | "canvas" | "html";
    onLoaded?: (event: Event) => any;
    onDataReady?: (event: Event) => any;
    onComplete?: (event: Event) => any;
    onLoopComplete?: (event: Event) => any;
    onEnterFrame?: (event: Event) => any;
    onSegmentStart?: (event: Event) => any;
    onIntersection?: (event: CustomEvent<IntersectionObserverEntry>) => any;
    onCreateAnimation?: (event: Event) => any;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
