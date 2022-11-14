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
                let descricaoCapa = imagens[i].descricao;
				if (estado.view.tipo === 'pessoa') {
					capa = imagens[i].imagem_pessoal_id;
				} else if (estado.view.tipo === 'comunidade') {
					capa = imagens[i].imagem_comunitaria_id;
				}
				arrayAlbuns.push({
					'nome': nome,
					'capa_id': capa,
                    'descricao_capa': descricaoCapa
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
                capa.setAttribute('alt', `capa do álbum ${album.nome}, ${album.descricao_capa}`);
                capa.setAttribute('title', `capa do álbum ${album.nome}, ${album.descricao_capa}`);
                capa.style.width = "100%";

                nome = document.createElement('p');
                nome.textContent = album.nome;
                nome.style.width = "100%";
                
				botao.appendChild(capa);
                botao.appendChild(nome);
                divLista.appendChild(botao);

                // define atributos para facilitar uso no event listener
                botao.setAttribute('album', album.nome);
                botao.setAttribute('tipo', estado.view.tipo);
                botao.setAttribute('localId', estado.view.id);

                botao.addEventListener('click', async e => {
                    let nomeAlbum = e.currentTarget.getAttribute('album');
                    let tipoLocal = e.currentTarget.getAttribute('tipo');
                    let idLocal = e.currentTarget.getAttribute('localId');

                    console.log('álbum clicado:', nomeAlbum);
                    let res = await serverFetch(`/${tipoLocal}s/${idLocal}/objetos/imagens`, 'GET');
                    let imagens = await res.json();
                    let arrayImagens = [];

                    for (let i = 0; i < imagens.length; i++) {
                        if (imagens[i].album === nomeAlbum) {
                            arrayImagens.push(imagens[i]);
                        }
                    }

                    let overlay = document.createElement('div');
                    overlay.style.display = "block";
                    overlay.style.position = "fixed";
                    overlay.style.zIndex = "2";
                    overlay.style.width = "100%";
                    overlay.style.height = "100%";
                    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    overlay.style.left = "0px";
                    overlay.style.top = "0px";
                    
                    let modalImagens = document.createElement('m-bloco');
                    modalImagens.style.display = "block";
                    modalImagens.style.position = "absolute";
                    modalImagens.style.textAlign = "center";
                    modalImagens.style.left = "50%";
                    modalImagens.style.top = "50%";
                    modalImagens.style.transform = "translate(-50%, -50%)";
                    modalImagens.style.margin = "0 auto";
                    modalImagens.style.width = "90%";
                    modalImagens.style.maxHeight = "90%";
                    modalImagens.style.zIndex = "3";

                    let elTitulo = document.createElement('h2');
                    elTitulo.textContent = nomeAlbum;
                    modalImagens.appendChild(elTitulo);
                    
                    arrayImagens.forEach(img => {
                        let elImg = document.createElement('img');
                        console.log('imagem:', img);
                        let imgId;
                        if (tipoLocal === 'pessoa') {
                            imgId = img.imagem_pessoal_id;
                        } else if (tipoLocal === 'comunidade') {
                            imgId = img.imagem_comunitaria_id;
                        }
                        elImg.src = `http://localhost:4000/${tipoLocal}s/${idLocal}/objetos/imagem?id=${imgId}`;
                        elImg.style.maxWidth = '33rem';
                        elImg.style.margin = "0.5rem";
                        elImg.setAttribute('alt', img.descricao);
                        elImg.setAttribute('title', img.descricao);
                        console.log('elImg', elImg);
                        modalImagens.appendChild(elImg);
                    });
                    
                    //modalImagens.appendChild(formAdicionar);
                    console.log('this', this);
                    this.appendChild(modalImagens);
                    this.appendChild(overlay);

                    overlay.addEventListener('click', e => {
                        e.preventDefault();
                        while (modalImagens.lastChild) {
                            modalImagens.removeChild(modalImagens.lastChild);
                        }
                        modalImagens.remove();
                        overlay.remove();
                    });
                });

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