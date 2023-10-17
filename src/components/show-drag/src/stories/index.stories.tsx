import { ShowDrag } from "@atomico/show-drag";
import { define } from "@atomico/storybook";
import "./style.css";

export default {
    title: "@atomico/show-drag",
    ...define(ShowDrag),
};

export const Story1 = (props) => (
    <ShowDrag {...props}>
        <div class="drag-visible-x" slot="drag-visible">
            <button></button>
            <button></button>
            <button></button>
            <button></button>
        </div>
        <div class="container-x"></div>
    </ShowDrag>
);
