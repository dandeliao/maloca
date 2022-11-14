import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MBlogs extends MalocaElement {
    constructor() {

        let html = `
        <div class="blogs">

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
        let arrayBlogs = [];

		let res = await serverFetch(`/${tipo}s/${id}/objetos/textos`, 'GET');
		let textos = await res.json();

		for (let i = 0; i < textos.length; i++) {
			let iguais = arrayBlogs.filter(blog => blog.nome === textos[i].blog);
			if (iguais.length === 0) { // se blog ainda não está na lista
				let nome = textos[i].blog;
				arrayBlogs.push({
					'nome': nome,
				})
			}
		}

        let divLista = document.createElement('div');

        if (arrayBlogs.length > 0) {
            let botao;
            let nome;
            arrayBlogs.forEach(blog => {
                console.log('blog:', blog);
                botao = document.createElement('button');
				botao.style.maxWidth = "10rem";

                nome = document.createElement('p');
                nome.textContent = blog.nome;
                nome.style.width = "100%";
                
                botao.appendChild(nome);
                divLista.appendChild(botao);

                // define atributos para facilitar uso no event listener
                botao.setAttribute('blog', blog.nome);
                botao.setAttribute('tipo', estado.view.tipo);
                botao.setAttribute('localId', estado.view.id);

                botao.addEventListener('click', async e => {
                    let nomeBlog = e.currentTarget.getAttribute('blog');
                    let tipoLocal = e.currentTarget.getAttribute('tipo');
                    let idLocal = e.currentTarget.getAttribute('localId');

                    console.log('blog clicado:', nomeBlog);
                    let res = await serverFetch(`/${tipoLocal}s/${idLocal}/objetos/textos`, 'GET');
                    let textos = await res.json();
                    let arrayTextos = [];

                    for (let i = 0; i < textos.length; i++) {
                        if (textos[i].blog === nomeBlog) {
                            arrayTextos.push(textos[i]);
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
                    
                    let modalTextos = document.createElement('m-bloco');
                    modalTextos.style.display = "block";
                    modalTextos.style.position = "absolute";
                    modalTextos.style.textAlign = "center";
                    modalTextos.style.left = "50%";
                    modalTextos.style.top = "50%";
                    modalTextos.style.transform = "translate(-50%, -50%)";
                    modalTextos.style.margin = "0 auto";
                    modalTextos.style.width = "90%";
                    modalTextos.style.maxHeight = "90%";
                    modalTextos.style.zIndex = "3";

                    let elTituloDoBlog = document.createElement('h2');
                    elTituloDoBlog.textContent = nomeBlog;
                    modalTextos.appendChild(elTituloDoBlog);
                    
                    arrayTextos.forEach(async txt => {
						let elTitulo = document.createElement('h3');
                        let elTexto = document.createElement('div');
                        console.log('texto:', txt);
                        let txtId;
                        if (tipoLocal === 'pessoa') {
                            txtId = txt.texto_pessoal_id;
                        } else if (tipoLocal === 'comunidade') {
                            txtId = txt.texto_comunitario_id;
                        }
						elTitulo.textContent = txt.titulo;
						let textinho = await serverFetch(`/${tipoLocal}s/${idLocal}/objetos/texto?id=${txtId}`, 'GET');
                        elTexto.innerHTML = await textinho.text();
						elTexto.style.textAlign = "left";
                        /* elImg.style.maxWidth = '33rem';
                        elImg.style.margin = "0.5rem";
                        elImg.setAttribute('alt', img.descricao);
                        elImg.setAttribute('title', img.descricao); */
                        console.log('elTexto', elTexto);
                        modalTextos.appendChild(elTitulo);
						modalTextos.appendChild(elTexto);
                    });
                    
                    //modalTextos.appendChild(formAdicionar);
                    console.log('this', this);
                    this.appendChild(modalTextos);
                    this.appendChild(overlay);

                    overlay.addEventListener('click', e => {
                        e.preventDefault();
                        while (modalTextos.lastChild) {
                            modalTextos.removeChild(modalTextos.lastChild);
                        }
                        modalTextos.remove();
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
            console.log("não há blogs para mostrar");
        }
    }
}

window.customElements.define('m-blogs', MBlogs);