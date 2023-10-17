import { KeenSliderInstance } from "keen-slider";
export declare const KeenSlider: import("atomico/types/dom").Atomico<{
    next: () => void;
    mode: "snap" | "free" | "free-snap";
    to: (slide: number) => void;
    autoplayLoop: number;
    onCreated: (event: Event) => any;
    onSlideChanged: (event: Event) => any;
    prev: () => void;
} & {
    initial?: number;
    disabled?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    drag?: boolean;
    rtl?: boolean;
    vertical?: boolean;
    rubberband?: boolean;
    currentSlide?: number;
    slidesPerView?: string;
    slidesSpacing?: string;
    slidesOrigin?: string;
    slider?: KeenSliderInstance;
    disableLeft?: boolean;
    disableRight?: boolean;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
