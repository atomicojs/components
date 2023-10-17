import { CompareContent } from "@atomico/compare-content";
import { define } from "@atomico/storybook";

export default {
    title: "@atomico/compare-content",
    ...define(CompareContent),
};

export const Story = (props) => (
    <CompareContent {...props}>
        <img
            slot="content"
            src="https://image-compare-viewer.netlify.app/public/before-3.jpg"
            alt=""
        />
        <img
            slot="content"
            src="https://image-compare-viewer.netlify.app/public/after-3.jpg"
            alt=""
        />
    </CompareContent>
);
