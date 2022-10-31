import MalocaElement from "./MalocaElement.js";

class MNome extends MalocaElement {
    constructor() {
        let html = `
        <div class="bloco">
		
			<span />

            <slot></slot>

        </div>
        `;

        super(html);
    }

	renderizar(estado) {
		
		let spanNome = this.shadowRoot.querySelector('span');
		spanNome.innerText = estado.view.id;

    }
}

window.customElements.define('m-nome', MNome);