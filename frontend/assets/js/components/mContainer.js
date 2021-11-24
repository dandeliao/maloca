import MalocaElement from "./MalocaElement.js";

const urlServidor = "http://localhost:4000";

class MContainer extends HTMLElement {
    constructor() {
        super();
        
        let comportamento = "fixo";
        if (this.flutuante) {
            comportamento = "flutuante";
        }


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
            <div class="page ${comportamento}">
    
                <div class="content ${comportamento}">
                    <slot></slot>
                </div>
    
                <style>
                
                    .page {
                        background: var(--background, white);
                        background-image: var(--background-image, url("${urlServidor + data.fundo}"));
                    }
    
                    .page.flutuante {
                        padding-top: 1rem;
                        min-height: 60rem;
                    }
    
                    .content {
                        display: block;
                        max-width: 960px;
                        margin: 0 auto;
                        padding: 1.2rem;
                        border-radius: 0.2rem;
                        background: var(--container-background, white);
                    }
    
                    .content.fixo {
                        height: 100%;
                        min-height: 60rem;
                        border-radius: 0;
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

    get flutuante() {
        return this.hasAttribute('flutuante');
    }
      
    set flutuante(ehFlutuante) {
        if (ehFlutuante) {
            this.setAttribute('flutuante', '');
        } else {
            this.removeAttribute('flutuante');
        }
    }

}

window.customElements.define('m-container', MContainer);