import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";
import { renderBlocos } from "../utils/rendering.js";

class MCriarComunidade extends MalocaElement {
    constructor() {

        let html = `
        <div class="criar-comunidade">

            <slot></slot>

			<style>
				.criar-comunidade {
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

        let botaoCriar = document.createElement('btn');
		botaoCriar.style.display = "inline-block";
		botaoCriar.style.position = "relative";
		botaoCriar.style.maxWidth = "15rem";
		botaoCriar.style.width = "100%";
		botaoCriar.style.height = "100%";
		botaoCriar.innerText = "➕ criar comunidade";
		this.appendChild(botaoCriar);
		botaoCriar.addEventListener('click', e => {

			let overlay = document.createElement('div');
			overlay.style.display = "block";
			overlay.style.position = "fixed";
			overlay.style.zIndex = "2";
			overlay.style.width = "100%";
			overlay.style.height = "100%";
			overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
			overlay.style.left = "0px";
			overlay.style.top = "0px";
			
			let modalCriar = document.createElement('m-bloco');
			modalCriar.style.display = "block";
			modalCriar.style.position = "absolute";
			modalCriar.style.left = "50%";
			modalCriar.style.top = "50%";
			modalCriar.style.transform = "translate(-50%, -50%)";
			modalCriar.style.margin = "0 auto";
			modalCriar.style.minWidth = "7rem";
			modalCriar.style.maxWidth = "15rem";
			modalCriar.style.zIndex = "3";
			

			let formCriar = document.createElement('form');
			formCriar.innerHTML = `
			<h3>Digite os dados da comunidade:</h3>
			<br>
			<label for="arroba" hidden>arroba</label>
			<input type="text" id="arroba-comunidade-nova" placeholder="@" name="arroba" required>
			<br>
			<br>
			<label for="nome" hidden>nome</label>
			<input type="text" id="nome-comunidade-nova" placeholder="Nome da Comunidade" name="nome" required>
			<br>
			<br>
			<label for="descricao" hidden>descricao</label>
			<input type="text" id="descricao-comunidade-nova" placeholder="Descricao da Comunidade" name="descricao" required>
			<br>
			<br>
			<br>
			<button type="submit">criar</button>
			`
			
			modalCriar.appendChild(formCriar);
			this.appendChild(modalCriar);
			this.appendChild(overlay);

			overlay.addEventListener('click', e => {
				e.preventDefault();
				while (modalCriar.lastChild) {
					modalCriar.removeChild(modalCriar.lastChild);
				}
				modalCriar.remove();
				overlay.remove();
			});

			formCriar.addEventListener('submit', async e => {
				e.preventDefault();
				let dadosNovaComuna = {
					comunidade_id: formCriar.elements['arroba'].value,
					nome: formCriar.elements['nome'].value,
					descricao: formCriar.elements['descricao'].value
				};
				serverFetch('/comunidades', 'POST', dadosNovaComuna)
        			.then(res => res.json())
        			.then(data => {            
           				 console.log('data m-criar-comunidade:', data);
						 renderBlocos(estado);
      			});
			});
		});
    }
}

window.customElements.define('m-criar-comunidade', MCriarComunidade);