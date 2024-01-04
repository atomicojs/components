import { Modal } from "@atomico/modal";
import { define } from "@atomico/storybook";
import "./style.css";

export default {
    title: "@atomico/modal",
    ...define(Modal, {
        args: {
            show: true,
            position: "center, right bottom 1080px",
        },
    }),
};

export const Story = (props) => (
    <Modal {...props}>
        <section class="modal-content">
            <img
                class="modal-image"
                src="https://media.giphy.com/media/Maslv9XBFXQMyFogjG/giphy.gif"
                alt=""
            />
            <button class="modal-button" data-modal="toggle">
                X
            </button>
        </section>
    </Modal>
);
