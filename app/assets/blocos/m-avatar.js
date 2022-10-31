import MalocaElement from "./MalocaElement.js";

class MAvatar extends MalocaElement {
    constructor() {
        let html = `
        <div class="bloco">
		
			<img />

            <slot></slot>

            <style>

				img {
					width: 100%;
				}
				
				.redondo {
					border-radius: 100%;
				}

            </style>

        </div>
        `;

        super(html);
		this.redondo = true;
    }

	renderizar(estado) {
		
		console.log('renderizando m-avatar...');

		let imgAvatar = this.shadowRoot.querySelector('img');
		let	url = `${estado.urlServidor}/${estado.view.tipo}s/${estado.view.id}/objetos/avatar`;

		imgAvatar.setAttribute('src', url);
		imgAvatar.setAttribute('alt', `avatar de ${estado.view.id}`);
		
		if (this.redondo === true) {
			imgAvatar.classList.add('redondo');
		} else {
			imgAvatar.classList.remove('redondo');
		}

    }

	/* get redondo() {
		let imgAvatar = this.shadowRoot.querySelector('img');
		if (imgAvatar.classList.contains('redondo')) {
			return true;
		} else {
			return false;
		}
	}

	set redondo(valor) {
		this.redondo = valor;
		let imgAvatar = this.shadowRoot.querySelector('img');
		if (valor === true) {
			imgAvatar.classList.add('redondo');
		} else {
			imgAvatar.classList.remove('redondo');
		}
	} */
}

window.customElements.define('m-avatar', MAvatar);