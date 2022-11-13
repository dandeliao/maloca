import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MAlbuns extends MalocaElement {
    constructor() {

        let html = `
        <div class="albuns">

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
        let arrayAlbuns = [];

		let res = await serverFetch(`/${tipo}s/${id}/objetos/imagens`, 'GET');
		let imagens = await res.json();

		for (let i = 0; i < imagens.length; i++) {
			let iguais = arrayAlbuns.filter(alb => alb.nome === imagens[i].album);
			if (iguais.length === 0) { // se álbum ainda não está na lista
				let nome = imagens[i].album;
				let capa;
				if (estado.view.tipo === 'pessoa') {
					capa = imagens[i].imagem_pessoal_id;
				} else if (estado.view.tipo === 'comunidade') {
					capa = imagens[i].imagem_comunitaria_id;
				}
				arrayAlbuns.push({
					'nome': nome,
					'capa_id': capa
				})
			}
		}

        let divLista = document.createElement('div');

        if (arrayAlbuns.length > 0) {
            let botao;
            let capa;
            let nome;
            arrayAlbuns.forEach(album => {
                console.log('album:', album);
                botao = document.createElement('button');
				botao.style.maxWidth = "10rem";

                capa = document.createElement('img');
                capa.setAttribute('src', `http://localhost:4000/${estado.view.tipo}s/${estado.view.id}/objetos/imagem?id=${album.capa_id}`);
                capa.setAttribute('alt', `capa do álbum ${album.nome}`);
                capa.style.width = "100%";

                nome = document.createElement('p');
                nome.textContent = album.nome;
                nome.width = "100%";
                
				botao.appendChild(capa);
                botao.appendChild(nome);
                divLista.appendChild(botao);
            });

            divLista.style.display = "flex";
            divLista.style.flexDirection = "row";
            divLista.style.gap = "1.75rem";
            divLista.style.flexWrap = "wrap";
            this.appendChild(divLista);
        
        } else {
            console.log("não há álbuns para mostrar");
        }
    }
}

window.customElements.define('m-albuns', MAlbuns);