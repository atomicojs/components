import { KeenSlider } from "@atomico/keen-slider";
import { define } from "@atomico/storybook";
import "./style.css";

export default {
    title: "components/keen-slider",
    ...define(KeenSlider, {
        args: {
            autoplay: true,
            slidesPerView: "1, 3 520px",
        },
    }),
};

export const Story = (props) => (
    <KeenSlider class="slider">
        <div slot="slide" class="slide">
            <h1>1</h1>
        </div>
        <div slot="slide" class="slide">
            <h1>2</h1>
        </div>
        <div slot="slide" class="slide">
            <h1>3</h1>
        </div>
        <div slot="slide" class="slide">
            <h1>4</h1>
        </div>
        <button class="button" slot="to-left">
            ←
        </button>
        <button class="button" slot="to-right">
            →
        </button>
        <button class="dot" slot="pagination">
            ●
        </button>
    </KeenSlider>
);
