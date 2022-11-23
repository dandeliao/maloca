import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarImagem extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-imagem">

            <slot></slot>

			<style>
				.adicionar-imagem {
					display: block;
					padding: 0;
					min-width: 5rem;
					width: 100%;
					text-align: center;
				}
			</style>

        </div>
        `
        super(html);

    }

    renderizar(estado) {

		while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let botaoAdicionar = document.createElement('btn');
		botaoAdicionar.style.display = "inline-block";
		botaoAdicionar.style.position = "relative";
		botaoAdicionar.style.maxWidth = "15rem";
		botaoAdicionar.style.width = "100%";
		botaoAdicionar.style.height = "100%";
		botaoAdicionar.innerText = "adicionar imagem";
		this.appendChild(botaoAdicionar);
		botaoAdicionar.addEventListener('click', e => {

			let overlay = document.createElement('div');
			overlay.style.display = "block";
			overlay.style.position = "fixed";
			overlay.style.zIndex = "2";
			overlay.style.width = "100%";
			overlay.style.height = "100%";
			overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
			overlay.style.left = "0px";
			overlay.style.top = "0px";
			
			let modalAdicionar = document.createElement('m-bloco');
			modalAdicionar.style.display = "block";
			modalAdicionar.style.position = "absolute";
			modalAdicionar.style.left = "50%";
			modalAdicionar.style.top = "50%";
			modalAdicionar.style.transform = "translate(-50%, -50%)";
			modalAdicionar.style.margin = "0 auto";
			modalAdicionar.style.minWidth = "7rem";
			modalAdicionar.style.maxWidth = "15rem";
			modalAdicionar.style.zIndex = "3";
			

			let formAdicionar = document.createElement('form');
			formAdicionar.setAttribute('enctype', 'multipart/form-data');
			formAdicionar.innerHTML = `
			<h3>Escolha a imagem:</h3>
			<br>
			<label for="arquivo" hidden>selecione um arquivo</label>
			<input id="arquivo-imagem" name="arquivo" type="file" />
			<br>
			<br>
			<label for="descricao" hidden>descrição</label>
			<input type="text" id="descricao-imagem" placeholder="descreva a imagem para pessoas com deficiência visual. Exemplo: foto de uma árvore alta sem folhas em um parque com grama esverdeada em um dia ensolarado" name="descricao" required>
			<br>
			<br>
			<label for="album" hidden>álbum</label>
			<input type="text" id="album-imagem" placeholder="nome-do-album" name="album" required>
			<br>
			<br>
			<br>
			<button type="submit">salvar imagem</button>
			`
			
			modalAdicionar.appendChild(formAdicionar);
			this.appendChild(modalAdicionar);
			this.appendChild(overlay);

			overlay.addEventListener('click', e => {
				e.preventDefault();
				while (modalAdicionar.lastChild) {
					modalAdicionar.removeChild(modalAdicionar.lastChild);
				}
				modalAdicionar.remove();
				overlay.remove();
			});

			formAdicionar.addEventListener('submit', async e => {
				e.preventDefault();

				const arquivo = formAdicionar.elements['arquivo-imagem'].files[0];
				const descricao = formAdicionar.elements['descricao'].value;
				const album = formAdicionar.elements['album'].value;

				let formData = new FormData();
				formData.append('descricao', descricao);
				formData.append('album', album);
				formData.append('arquivo', arquivo);

				serverFetch(`/${estado.view.tipo}s/${estado.view.id}/objetos/imagens`, 'POST', formData)
        			.then(res => res.json())
        			.then(data => {            
						renderBlocos(estado);
      			});
			});
		});
    }
}

window.customElements.define('m-adicionar-imagem', MAdicionarImagem);