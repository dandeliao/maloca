import MalocaElement from "./MalocaElement.js";

const urlServidor = "http://localhost:4000";

class MPessoas extends MalocaElement {
    constructor() {

        let html = `
        <div class="mpessoas">

            <slot></slot>

        </div>
        `
        super(html);

    }

    connectedCallback() {

        let endereco = urlServidor;
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
                endereco = `${urlServidor}/api/pessoas/${nome}`;
            } else if (pessoinha) {
                tipo = "pessoa";
                nome = pessoinha[1];
                endereco = `${urlServidor}/api/pessoas/${nome}`;
            } else if (comuninha) {
                tipo = "comunidade"
                nome = comuninha[1];
                endereco = `${urlServidor}/api/comunidades/${nome}`;
            } else {
                tipo = "instancia";
                nome = "maloca";
                endereco = `${urlServidor}/api/instancias/${nome}`;
            }
        }

        let divLista = document.createElement('div');

        fetch(endereco)
        .then(res => res.json())
        .then(data => {
            // precisava ser uma query para o banco de dados, que cruzaria infos para
            // informar as pessoas de uma determinada pessoa ou instância.
            if (data.pessoas) {
                let linkzinho;
                data.pessoas.forEach(e => {
                    linkzinho = document.createElement('m-link');
                    linkzinho.textContent = e;
                    linkzinho.href = `/pessoa/${e}`;
                    divLista.appendChild(linkzinho);
                });

                divLista.style.display = "flex";
                divLista.style.flexDirection = "column";
                this.appendChild(divLista);
            
            } else {
                console.log("não há pessoas para mostrar");
            }
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

}

window.customElements.define('m-pessoas', MPessoas);