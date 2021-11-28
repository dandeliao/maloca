//import MalocaElement from "./MalocaElement.js";

const urlServidor = "http://localhost:4000";

class MAvatar extends HTMLElement {
    constructor() {
        super();

        let endereco = urlServidor;
        let tipo = this.tipo;
        let nome = this.nome;
        let tamanho = this.tamanho;

        if (!tamanho) {
            tamanho = "m";
        }

        if (!tipo && !nome) {
            let painelRegex = /^\/painel$/;
            let pessoaRegex = /^\/pessoa\/(\w{2,}(-?\w+)+)$/i;
            let comunaRegex = /^\/(\w{2,}(-?\w+)+)$/i;

            let painel = painelRegex.exec(location.pathname);
            let pessoinha = pessoaRegex.exec(location.pathname);
            let comuninha = comunaRegex.exec(location.pathname);

            if (painel) {
                tipo = "pessoa";
                nome = "rukib"; // como saber quem está logado?
            } else if (pessoinha) {
                tipo = "pessoa";
                nome = pessoinha[1];
            } else if (comuninha) {
                tipo = "comunidade"
                nome = comuninha[1];
            } else {
                tipo = "instancia";
                nome = "maloca";
            }
        }

        if (tipo === "pessoa") {
            endereco += `/api/pessoas/${nome}`;
        } else if (tipo === "comunidade") {
            endereco += `/api/comunidades/${nome}`;
        } else if (tipo === "instancia") {
            if (nome === "maloca") {
                endereco += `/api/instancias/maloca`;
            } else {
                // falta programar lógica p/ acessar dados de outras instâncias
                console.log("tentou acessar instância externa");
            }
        } else {
            console.log("avatar de tipo desconhecido");
        }

        fetch(endereco)
        .then(res => res.json())
        .then(data => {

            let html = `
            <div class="mavatar">
    
                <img src="${urlServidor + data.avatar}" class="${tamanho}">
    
                <style>
    
                    .mavatar img {
                        width: 8rem;
                        height: 8rem;
                        border-radius: 100%;
                        object-fit:cover;
                    }
    
                    .mavatar img.pp {
                        width: 1.8rem;
                        height: 1.8rem;
                    }
                    .mavatar img.p {
                        width: 4rem;
                        height: 4rem;
                    }
                    .mavatar img.m {
                        width: 8rem;
                        height: 8rem;
                    }
                    .mavatar img.g {
                        width: 12rem;
                        height: 12rem;
                    }
                    .mavatar img.gg {
                        width: 16rem;
                        height: 16rem;
                    }
                    
                </style>
            </div>
            `
            let template = document.createElement('template');
            template.innerHTML = html;
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.firstElementChild.cloneNode(true));

        });

        
    }

    get tipo() {
        return this.getAttribute('tipo');
    }
      
    set tipo(novoTipo) {
        this.setAttribute('tipo', novoTipo);
    }

    get nome() {
        return this.getAttribute('nome');
    }
      
    set nome(novoNome) {
        this.setAttribute('nome', novoNome);
    }

    get tamanho() {
        return this.getAttribute('tamanho');
    }
      
    set tamanho(novoTamanho) {
        this.setAttribute('tamanho', novoTamanho);
    }
}

window.customElements.define('m-avatar', MAvatar);