import MalocaElement from "./MalocaElement.js";
import { getState } from "../utils/state.js";
import { serverFetch } from "../utils/fetching.js";

class MComunidades extends MalocaElement {
    constructor() {

        let html = `
        <div class="mcomunidades">

            <slot></slot>

        </div>
        `
        super(html);

    }

    renderizar(estado) {

        let endereco = '';
        let tipo = estado.view.tipo;
        let nome = estado.view.nome;

        if (tipo === 'pessoa') {
            endereco = `/pessoas/${nome}/objetos/comunidades`
        } else if (tipo === 'comunidade') {
            endereco = `/comunidades`
        }

        let divLista = document.createElement('div');

        serverFetch(endereco, 'GET')
        .then(res => res.json())
        .then(data => {
            
            console.log('data m-comunidades:', data);

            if (data.length > 0) {
                let card;
                let linkzinho;
                let avatar;
                data.forEach(comuna => {
                    card = document.createElement('div');

                    avatar = document.createElement('img');
                    avatar.setAttribute('src', `http://localhost:4000/comunidades/${comuna.comunidade_id}/objetos/avatar`);
                    avatar.setAttribute('alt', `avatar de ${comuna.nome}`);

                    linkzinho = document.createElement('a');
                    linkzinho.textContent = comuna.nome;
                    linkzinho.setAttribute('data-link', 'true');
                    linkzinho.setAttribute('href', `/${comuna.comunidade_id}`);
                    
                    card.appendChild(avatar);
                    card.appendChild(linkzinho);
                    divLista.appendChild(card);
                });

                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.justifyContent = "center";
                card.style.alignItems = "center";
                divLista.style.display = "flex";
                divLista.style.flexDirection = "column";
                this.appendChild(divLista);
            
            } else {
                console.log("não há comunidades para mostrar");
            }
        });
    }
}

window.customElements.define('m-comunidades', MComunidades);