const urlServidor = "http://localhost:4000";

class MFundo extends HTMLElement {
    constructor() {
        super();

        let endereco = urlServidor;
        let corDeFundo = "#FFFFFF";
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
            console.log("imagem de fundo de tipo desconhecido");
        }

        fetch(endereco)
        .then(res => res.json())
        .then(data => {
            /* switch(data.fundo) {
                case "png":
                case "gif":
                case "jpg":
                case "jpeg":
                    endereco = endereco + "/fundo." + data.fundo;
                    break;
                default:
                    endereco = "";
                    corDeFundo = data.fundo;
              } */


              let html = `
              <div class="mfundo">
      
                  <img src="${urlServidor + data.fundo}">
      
                  <style>
                    .mfundo {
                        background-image: ${urlServidor + data.fundo};
                        height: 100%;
                    }    
                    .mfundo img {
                        width: 100%;
                        height: auto;
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

}

window.customElements.define('m-fundo', MFundo);