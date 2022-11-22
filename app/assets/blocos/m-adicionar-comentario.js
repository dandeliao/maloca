import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarComentario extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-comentario">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        const textoId = this.getAttribute('texto');
		const imagemId = this.getAttribute('imagem');
		let midiaTipo;
		let midiaId;
		if (textoId) {
			midiaTipo = 'texto';
			midiaId = textoId;
		} else if (imagemId) {
			midiaTipo = 'imagem';
			midiaId = imagemId;
		}

		const comunidadeId = this.getAttribute('comunidade') ? this.getAttribute('comunidade') : estado.view.id;

		// cria form para adicionar novo comentário
		let formAdicionar = document.createElement('form');
		formAdicionar.innerHTML = `
			<label for="comentario" hidden>novo comentário</label>
			<textarea id="novo-comentario" placeholder="novo comentário" name="comentario" required style="width: 100%; min-height: 3rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
			<br>
			<br>
			<button type="submit">comentar</button>
			`;
		formAdicionar.style.margin = '1rem 0';
		formAdicionar.classList.add('comentario');
		this.appendChild(formAdicionar);

		formAdicionar.addEventListener('submit', async e => {
			e.preventDefault();

			const dados = {
				texto: 	formAdicionar.elements['comentario'].value
			}

			serverFetch(`/comunidades/${comunidadeId}/objetos/comentarios?${midiaTipo}=${midiaId}`, 'POST', dados)
				.then(res => res.json())
				.then(data => {            
						console.log('data comentário novo:', data);
					renderBlocos(estado);
			});
		});
    }
}

window.customElements.define('m-adicionar-comentario', MAdicionarComentario);