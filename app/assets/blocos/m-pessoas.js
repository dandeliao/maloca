import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MPessoas extends MalocaElement {
    constructor() {

        let html = `
        <div class="pessoas">

            <slot></slot>

        </div>
        `
        super(html);

    }

    renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;
		let endereco = `/comunidades/${id}/objetos/pessoas`;


        let divLista = document.createElement('div');

        serverFetch(endereco, 'GET')
        .then(res => res.json())
        .then(data => {
            
            console.log('data m-pessoas:', data);

            if (data.length > 0) {
                let card;
                let linkzinho;
                let avatar;
                data.forEach(pessoinha => {
                    card = document.createElement('div');
					card.style.display = "flex";
                    card.style.flexDirection = "column";
                    card.style.justifyContent = "start";
                    card.style.alignItems = "center";
                    card.style.gap = "0.25rem";
                    card.style.maxWidth = "5rem";

                    avatar = document.createElement('img');
                    avatar.setAttribute('src', `http://localhost:4000/pessoas/${pessoinha.pessoa_id}/objetos/avatar`);
                    avatar.setAttribute('alt', `avatar de ${pessoinha.pessoa_id}`);
                    avatar.style.width = "100%";

                    linkzinho = document.createElement('a');
                    linkzinho.textContent = pessoinha.pessoa_id;
                    linkzinho.setAttribute('data-link', 'true');
                    linkzinho.setAttribute('href', `/pessoa/${pessoinha.pessoa_id}`);
                    linkzinho.style.display = "block";
                    linkzinho.width = "100%";
                    
                    card.appendChild(avatar);
                    card.appendChild(linkzinho);
                    divLista.appendChild(card);
                });

				
                divLista.style.display = "flex";
                divLista.style.flexDirection = "row";
                divLista.style.gap = "1.75rem";
                divLista.style.flexWrap = "wrap";
                this.appendChild(divLista);
            
            } else {
                console.log("não há pessoas para mostrar");
            }
        });
    }
}

window.customElements.define('m-pessoas', MPessoas);