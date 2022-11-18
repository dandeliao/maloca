import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MBlog extends MalocaElement {
    constructor() {

        let html = `
        <div class="blog">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;
        let nomeBlog = this.getAttribute('nome');

		let res = await serverFetch(`/${tipo}s/${id}/objetos/textos?blog=${nomeBlog}`, 'GET');
		let textos = await res.json();

		console.log('!!!!!!!!!! textos:', textos);

		if (textos.length > 0) {

			let elTituloDoBlog = document.createElement('h2');
			elTituloDoBlog.textContent = nomeBlog;
			this.appendChild(elTituloDoBlog);
			
			textos.forEach(async txt => {
				console.log('texto:', txt);
				let elBloco = document.createElement('m-bloco');
				let elTexto = document.createElement('m-texto');
				
				let textoId;
				if (tipo === 'pessoa') {
					textoId = txt.texto_pessoal_id;
				} else if (tipo === 'comunidade') {
					textoId = txt.texto_comunitario_id;
				}

				elTexto.setAttribute('numero', textoId);
				elTexto.setAttribute(`${tipo}`, id);

				elBloco.appendChild(elTexto);
				this.appendChild(elBloco);
				this.appendChild(document.createElement('br'));

				elTexto.renderizar(estado);
			});
		} else {
			console.log('Não há textos para mostrar');
		}
    }
}

window.customElements.define('m-blog', MBlog);