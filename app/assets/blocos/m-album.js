import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MAlbum extends MalocaElement {
    constructor() {

        let html = `
        <div class="album">

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
        let nomeAlbum = this.getAttribute('nome');

		let res = await serverFetch(`/${tipo}s/${id}/objetos/imagens?album=${nomeAlbum}`, 'GET');
		let imagens = await res.json();

		console.log('!!!!!!!!!! imagens:', imagens);

		if (imagens.length > 0) {

			let elTituloDoAlbum = document.createElement('h2');
			elTituloDoAlbum.textContent = nomeAlbum;
			this.appendChild(elTituloDoAlbum);
			
			imagens.forEach(async img => {
				console.log('imagem:', img);
				let elBloco = document.createElement('m-bloco');
				let elImg = document.createElement('m-imagem');
				
				let imagemId;
				if (tipo === 'pessoa') {
					imagemId = img.imagem_pessoal_id;
				} else if (tipo === 'comunidade') {
					imagemId = img.imagem_comunitaria_id;
				}				

				elImg.setAttribute('numero', imagemId);
				elImg.setAttribute(`${tipo}`, id);
				
				elBloco.appendChild(elImg);

				this.appendChild(elBloco);
				this.appendChild(document.createElement('br'));
				
				elImg.renderizar(estado);
			});

		} else {
			console.log('Não há imagens para mostrar');
		}
    }
}

window.customElements.define('m-album', MAlbum);