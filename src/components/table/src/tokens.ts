import { css } from "atomico";

export const tokens = css`
    @tokens "../tokens.yaml" (prefix: table);
`;

console.info(tokens);
