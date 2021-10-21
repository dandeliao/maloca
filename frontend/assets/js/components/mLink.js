import MalocaElement from "./MalocaElement.js";

class MLink extends MalocaElement {
    constructor() {
        let html = `
        <div class="link">

            <slot></slot>

            <style>

                .link {
                    text-decoration: underline;
                    cursor: pointer;
                }
                
            </style>
        </div>
        `
        super(html);
        this.setAsDataLink();
    }

    setAsDataLink() {
        this.setAttribute("data-link", "");
    }


}

window.customElements.define('m-link', MLink);