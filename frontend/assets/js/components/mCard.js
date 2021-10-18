import MalocaElement from "./MalocaElement.js";

class MCard extends MalocaElement {
    constructor() {
        let html = `
        <div class="card">

            <slot></slot>

            <style>

                .card {
                    box-sizing: border-box;
                    margin: 20px auto;
                    background: var(--background-card, #FFFFFF);
                    width: 100%;
                    border-radius: 0.6rem;
                    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
                    padding: 0.8rem;
                }
                
            </style>
        </div>
        `
        super(html);
    }
}

window.customElements.define('m-card', MCard);