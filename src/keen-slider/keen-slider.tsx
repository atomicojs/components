import { Type, Host, Props, c, css, useRef, useEffect, useProp } from "atomico";
import Keen, { KeenSliderInstance } from "keen-slider";
import { useProxySlot } from "@atomico/hooks/use-slot";
import style from "./keen-slider.css";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";

function component(props: Props<typeof component>): Host<{
    onCreateSlider: Event;
    next: () => void;
    prev: () => void;
}> {
    const [slider, setSlider] = useProp<KeenSliderInstance>("slider");
    const refRoot = useRef();
    const refSlides = useRef();
    const slotSlides = useProxySlot<HTMLElement>(refSlides);

    const slidesPerView = useResponsiveState(props.slidesPerView || "");
    const slidesSpacing = useResponsiveState(props.slidesPerView || "");
    const slidesOrigin = useResponsiveState(props.slidesOrigin || "");

    useEffect(() => {
        if (!slotSlides.length) return;
        const slider = new Keen(refRoot.current, {
            loop: props.loop,
            drag: props.drag,
            disabled: props.disabled,
            rtl: props.rtl,
            rubberband: props.rubberband,
            initial: props.initial,
            mode: props.mode,
            vertical: !!props.vertical,
            slides: {
                perView: slidesPerView,
                spacing: slidesSpacing,
                // origin: slidesOrigin,
            },
        });

        setSlider(slider);

        return () => slider.destroy();
    }, [slotSlides.length, slidesPerView, slidesSpacing, slidesOrigin]);

    const next = () => slider.next();

    const prev = () => slider.prev();

    return (
        <host shadowDom next={next} prev={prev}>
            <slot ref={refSlides} name="slide"></slot>
            <slot onclick={prev} name="to-left"></slot>
            <slot onclick={next} name="to-right"></slot>
            <div class="keen-slider" ref={refRoot}>
                {slotSlides.map((element, id) => {
                    const name = `slide-${id}`;
                    element.slot = name;
                    return (
                        <div class="keen-slider__slide">
                            <slot name={name}></slot>
                        </div>
                    );
                })}
            </div>
        </host>
    );
}

component.props = {
    loop: Boolean,
    drag: Boolean,
    disabled: Boolean,
    vertical: Boolean,
    rtl: Boolean,
    rubberband: Boolean,
    initial: Number,
    mode: {
        type: String,
        value: (): "snap" | "free" | "free-snap" => "snap",
    },
    slidesPerView: String,
    slidesSpacing: String,
    slidesOrigin: String,
    slider: {
        type: null as Type<KeenSliderInstance>,
        event: {
            type: "CreateSlider",
        },
    },
};

component.styles = style;

export const KeenSlider = c(component);

customElements.define("atomico-keen-slider", KeenSlider);
