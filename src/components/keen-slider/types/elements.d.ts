import { KeenSliderInstance } from "keen-slider";
export declare const KeenSlider: import("atomico/types/dom").Atomico<{
    loop?: boolean;
    drag?: boolean;
    disabled?: boolean;
    vertical?: boolean;
    rtl?: boolean;
    rubberband?: boolean;
    autoplay?: boolean;
    autoplayLoop?: number;
    initial?: number;
    currentSlide?: number;
    mode?: "snap" | "free" | "free-snap";
    slidesPerView?: string;
    slidesSpacing?: string;
    slidesOrigin?: string;
    slider?: KeenSliderInstance;
    disableLeft?: boolean;
    disableRight?: boolean;
    onCreated?: (event: Event) => any;
    onSlideChanged?: (event: Event) => any;
    next?: () => void;
    prev?: () => void;
    to?: (slide: number) => void;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
