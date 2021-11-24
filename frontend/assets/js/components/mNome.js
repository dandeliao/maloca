class MNome extends HTMLElement {
    constructor() {
        super();

        let endereco = "/";
        let tipo = this.tipo;
        let nome = this.nome;

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

        let html = `
                    <span>${nome}</span>
                `
        let template = document.createElement('template');
        template.innerHTML = html;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.firstElementChild.cloneNode(true));
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

}

window.customElements.define('m-nome', MNome);