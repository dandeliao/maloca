import MalocaElement from "./MalocaElement.js";

class MContainer extends MalocaElement {
    constructor() {
        let html = `
        <div class="page">

            <div class="content">
                <slot></slot>
            </div>

            <style>
            
                .page {
                    background: var(--background, white);
                    background-image: var(--background-image, none);
                    min-height: 54rem;
                    padding-top: 1rem;
                }

                .content {
                    display: block;
                    max-width: 960px;
                    margin: 0 auto;
                    padding: 1.2rem;
                    border-radius: 0.2rem;
                    background: var(--background-container, white);
                }

            </style>
        </div>
        `
        super(html);
    }
}

window.customElements.define('m-container', MContainer);