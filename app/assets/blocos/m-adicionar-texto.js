import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MAdicionarTexto extends MalocaElement {
    constructor() {

        let html = `
        <div class="adicionar-texto">

            <slot></slot>

			<style>
				.adicionar-texto {
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
		botaoAdicionar.innerText = "adicionar texto";
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
			modalAdicionar.style.minWidth = "90%";
			//modalAdicionar.style.maxWidth = "15rem";
			modalAdicionar.style.zIndex = "3";
			

			let formAdicionar = document.createElement('form');
			formAdicionar.setAttribute('enctype', 'multipart/form-data');
			formAdicionar.innerHTML = `
			<h3>Adicionar texto:</h3>
			<br>
			<label for="titulo" hidden>título</label>
			<input type="text" id="titulo-texto" placeholder="Título do texto" name="titulo" style="width: 100%"/>
			<br>
			<br>
			<label for="texto" hidden>texto</label>
			<textarea id="markdown-texto" placeholder="Escreva aqui o texto que quer publicar. Se você souber algo de html, pode usar pra estilizar o texto, adicionar imagens, etc." name="texto" required style="width: 100%; min-height: 30rem"></textarea>
			<br>
			<br>
			<label for="blog" hidden>nome do blog</label>
			<input type="text" id="blog-texto" placeholder="nome-do-blog" name="blog" required style="width: 100%">
			<br>
			<br>
			<br>
			<button type="submit">salvar texto</button>
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

				const dados = {
					titulo: formAdicionar.elements['titulo'].value,
					texto: 	formAdicionar.elements['texto'].value,
					blog:	formAdicionar.elements['blog'].value
				}

				serverFetch(`/${estado.view.tipo}s/${estado.view.id}/objetos/textos`, 'POST', dados)
        			.then(res => res.json())
        			.then(data => {            
           				 console.log('data m-adicionar-texto:', data);
						renderBlocos(estado);
      			});
			});
		});
    }
}

window.customElements.define('m-adicionar-texto', MAdicionarTexto);