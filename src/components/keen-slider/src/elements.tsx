import {
    Type,
    Host,
    Props,
    c,
    useRef,
    useEffect,
    useProp,
    useState,
} from "atomico";
import Keen, { KeenSliderInstance, KeenSliderOptions } from "keen-slider";
import { useProxySlot } from "@atomico/hooks/use-slot";
import style from "./keen-slider.css";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";
import { useRender } from "@atomico/hooks/use-render";
import { JSX } from "atomico";

function component(props: Props<typeof component>): Host<{
    onCreated: Event;
    onSlideChanged: Event;
    next: () => void;
    prev: () => void;
    to: (slide: number) => void;
}> {
    const [slider, setSlider] = useProp<KeenSliderInstance>("slider");
    const [lastInteraction, setLastInteraction] = useState<boolean>();

    const refRoot = useRef();
    const refSlides = useRef();
    const refPagination = useRef();
    const slotSlides = useProxySlot<HTMLElement>(refSlides);
    const [PaginationItemTemplate] =
        useProxySlot<JSX<{ index: number; active: boolean }>>(refPagination);

    const slidesPerView = useResponsiveState(props.slidesPerView || "");
    const slidesSpacing = useResponsiveState(props.slidesSpacing || "");
    const slidesOrigin = useResponsiveState(props.slidesOrigin || "");

    const [currentSlide, setCurrentSlide] = useProp("currentSlide");

    const next = () => slider && slider.next();

    const prev = () => slider && slider.prev();

    const to = (value: number) => {
        if (slider && slider.track.details.rel != value) {
            slider.moveToIdx(value);
            setLastInteraction(true);
        }
    };

    useEffect(() => {
        if (!slider || !props.autoplay) return;

        if (!lastInteraction) {
            const interval = setInterval(() => next(), props.autoplayLoop);
            return () => clearInterval(interval);
        } else {
            const interval = setTimeout(
                () => setLastInteraction(false),
                props.autoplayLoop
            );
            return () => clearTimeout(interval);
        }
    }, [slider, lastInteraction, props.autoplay, props.autoplayLoop]);

    useEffect(() => {
        if (!slotSlides.length) return;

        const init: KeenSliderOptions = {
            loop: props.loop,
            drag: props.drag,
            disabled: props.disabled,
            rtl: props.rtl,
            rubberband: props.rubberband,
            initial: props.initial,
            mode: props.mode,
            vertical: props.vertical,
            slides: {
                perView:
                    slidesPerView === "auto"
                        ? slidesPerView
                        : Number(slidesPerView),
                spacing: Number(slidesSpacing),
                origin:
                    slidesOrigin === "auto" || slidesOrigin === "center"
                        ? slidesOrigin
                        : Number(slidesOrigin),
            },
        };
        // clean empty props
        for (let prop in init) {
            if (init[prop] == null) {
                delete init[prop];
            }
        }

        const slider = new Keen(refRoot.current, init);

        setSlider(slider);

        setCurrentSlide(props.initial || 0);

        slider.on("slideChanged", () => {
            setCurrentSlide(slider.track.details.rel);
        });

        return () => slider.destroy();
    }, [slotSlides.length, slidesPerView, slidesSpacing, slidesOrigin]);

    useEffect(() => {
        to(currentSlide);
    }, [currentSlide]);

    useRender(
        () =>
            PaginationItemTemplate && (
                <div slot="pagination-items">
                    {slotSlides.map((slide, i) => (
                        <PaginationItemTemplate
                            index={i}
                            active={currentSlide === i}
                            onclick={() => to(i)}
                            cloneNode
                        ></PaginationItemTemplate>
                    ))}
                </div>
            ),
        [PaginationItemTemplate, currentSlide, to]
    );

    return (
        <host
            shadowDom
            next={next}
            prev={prev}
            to={to}
            onclick={() => setLastInteraction(true)}
        >
            <slot ref={refSlides} name="slide"></slot>
            <slot onclick={prev} name="to-left"></slot>
            <slot onclick={next} name="to-right"></slot>
            <slot name="pagination" ref={refPagination}></slot>
            <slot name="pagination-items"></slot>
            <div class="keen-slider" ref={refRoot}>
                {slotSlides.map((element, id) => {
                    const name = `slide-${id}`;
                    element.slot = name;
                    if (id === currentSlide) {
                        element.dataset.slide = "current";
                    } else if (id === currentSlide + 1) {
                        element.dataset.slide = "next";
                    } else if (id === currentSlide - 1) {
                        element.dataset.slide = "prev";
                    } else {
                        delete element.dataset.slide;
                    }
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
    autoplay: Boolean,
    autoplayLoop: {
        type: Number,
        value: 2000,
    },
    initial: Number,
    currentSlide: {
        type: Number,
        event: { type: "SlideChanged" },
    },
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
            type: "Created",
        },
    },
};

component.styles = style;

export const KeenSlider = c(component);
