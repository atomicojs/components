import { Lottie } from "@atomico/lottie";
import { define } from "@atomico/storybook";

export default {
    title: "components/lottie",
    ...define(Lottie, {
        args: {
            cdn: true,
            path: "https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json",
            lazyload: true,
            intersectionControl: true,
        },
    }),
};

export const Story = (props) => <Lottie {...props}></Lottie>;
