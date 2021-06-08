import { html } from "atomico";
import { fixture } from "atomico/test-dom";
import {
    getPath,
    redirect,
    RouterRedirect,
    RouterSwitch,
    RouterCase,
} from "./router.js";
import { expect } from "@esm-bundle/chai";

describe("Components", () => {
    it("RouterRedirect", async () => {
        const ref = {};

        const routerRedirect = fixture(html`
            <${RouterRedirect} path="/home">
                <a ref=${ref} href="/sub-path">link</a>
            </${RouterRedirect}>
        `);

        await routerRedirect.updated;

        ref.current.click();

        expect(getPath()).to.equal("/home/sub-path");
    });

    it("RouterSwitch > RouterCase", async () => {
        const routerSwitch = fixture(html`<${RouterSwitch}>
            <${RouterCase} path="/" for="home"/>
            <${RouterCase} path="/[...404]" for="404"/>
            <h1 slot="home">home</h1>
            <h1 slot="404">404</h1>
        </${RouterSwitch}>`);

        await routerSwitch.updated;

        const steps = ["/", "/404"];

        routerSwitch.addEventListener("Request", (event) => {
            expect(steps.shift()).to.equal(getPath());
        });

        redirect("/");

        await routerSwitch.updated;

        // sleep
        await new Promise((resolve) => setTimeout(resolve, 100));

        redirect("/404");

        await routerSwitch.updated;

        expect(steps.length).to.equal(0);
    });
});
