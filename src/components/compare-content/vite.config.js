import atomico from "@atomico/vite";

export default {
    plugins: atomico({
        cssLiterals: {
            postcss: true,
        },
    }),
};
