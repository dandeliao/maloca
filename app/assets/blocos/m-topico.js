import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MTopico extends MalocaElement {
    constructor() {

        let html = `
        <div class="topico">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

		this.style.display = 'inline-block';

		let tipoOrigem = estado.view.tipo;
		let idOrigem = estado.view.id;

		let topicoID = this.getAttribute('numero');
		let res = await serverFetch(`/${tipoOrigem}s/${idOrigem}/objetos/topico?id=${topicoID}`, 'GET');
		let topico = await res.json();

		let elTitulo = document.createElement('h3');
		elTitulo.innerText = topico.titulo;
		elTitulo.style.textAlign = 'center';
		elTitulo.style.marginBottom = '2rem';

		this.appendChild(elTitulo);
    }
}

window.customElements.define('m-topico', MTopico);