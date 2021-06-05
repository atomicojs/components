import { c, useEffect, useHost, useState } from "atomico";
import { usePromise } from "@atomico/hooks/use-promise";

function sendForm({ action, method, mode, cache, credentials, json, headers }) {
    const host = useHost();
    const [submit, setSubmit] = useState();

    const [response, status] = usePromise(
        async () => {
            const formData = new FormData(host.current.querySelector("form"));

            const body = json
                ? JSON.stringify(
                      [...formData].reduce(
                          (body, [name, value]) => ({
                              ...body,
                              [name]: value,
                          }),
                          {}
                      )
                  )
                : formData;

            const response = await fetch(action, {
                method,
                mode,
                cache,
                credentials,
                headers: json
                    ? { ...headers, "Content-Type": "application/json" }
                    : headers,
                body,
            });

            return response.json();
        },
        submit,
        [action, method, mode, cache, credentials]
    );

    useEffect(() => {
        if (status == "fulfilled" || status == "rejected") setSubmit(false);
    }, [status]);

    return (
        <host
            shadowDom
            status={status}
            response={response}
            onsubmit={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setSubmit(true);
            }}
        >
            <slot></slot>
            {status == "pending" && <slot name="pending"></slot>}
            {status == "rejected" && <slot name="rejected"></slot>}
            {status == "fulfilled" && <slot name="fulfilled"></slot>}
        </host>
    );
}

sendForm.props = {
    response: null,
    action: String,
    mode: String,
    cache: String,
    json: Boolean,
    headers: Object,
    method: { type: String, value: "post" },
    credentials: { type: String, value: "same-origin" },
    status: {
        type: String,
        reflect: true,
        event: { type: "FormFetchStatus", bubbles: true, composed: true },
    },
};

export const SendForm = c(sendForm);

customElements.define("a-send-form", SendForm);
