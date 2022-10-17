import MalocaElement from "./MalocaElement.js"; // ver como essa importação se comporta no cliente

class MBloco extends MalocaElement {
    constructor() {
        console.log('construindo m-bloco');
        let html = `
        <div class="bloco">
	        
            <slot></slot>

            <style>
            .bloco {
                box-sizing: border-box;
                margin: 20px auto;
                background: var(--background, #FEFEFE);
                width: var(--width, 100%);
                border-radius: var(--border-radius, 0.4rem);
                border-style: var(--border-style, none);
                box-shadow: var(--box-shadow, 3px 4px 10px rgba(0, 0, 0, 0.2));
                padding: 0.8rem;
            }
            </style>

        </div>
        `;

        super(html);
    }
}

window.customElements.define('m-bloco', MBloco);