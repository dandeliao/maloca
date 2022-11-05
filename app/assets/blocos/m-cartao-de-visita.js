import MalocaElement from "./MalocaElement.js";

class MCartaoDeVisita extends MalocaElement {
    constructor() {
        
        let html = `
        <div class="bloco">

			<slot></slot>

			<style>
            .bloco {
                box-sizing: border-box;
				display: block;
				position: relative;
                margin: 0 auto;
                background: var(--background, #FEFEFE);
                width: var(--width, 100%);
                border-radius: var(--border-radius, 0.4rem);
                border-style: var(--border-style, none);
                box-shadow: var(--box-shadow, 2px 3px 4px rgba(0, 0, 0, 0.2));
            }
            </style>

        </div>
        `;

        super(html);
    }

	renderizar(estado) {
		
		console.log('renderizando m-cartao-de-visita...');

		let divCartao = this.shadowRoot.querySelector('.bloco');
		let divFundo = document.createElement('div');
		divFundo.setAttribute('id', 'fundo');
		let divTexto = document.createElement('div');
		divTexto.setAttribute('id', 'texto');
		let mAvatar = document.createElement('m-avatar');
		let divEspaco = document.createElement('div');
		divEspaco.setAttribute('id', 'espaco');
		let mNome = document.createElement('m-nome');
		let mDescricao = document.createElement('m-descricao');

		divCartao.appendChild(divFundo);
		divTexto.appendChild(divEspaco);
		divTexto.appendChild(mNome);
		divTexto.appendChild(mDescricao);
		divCartao.appendChild(divTexto);
		divCartao.appendChild(mAvatar);

		this.style.display = 'block';

		divCartao.style.position = 'relative';

		divFundo.style.height = '7.2rem'
		divFundo.style.backgroundImage = `url('${estado.urlServidor}/${estado.view.tipo}s/${estado.view.id}/objetos/fundo')`;
		divFundo.style.display = 'block';
		divFundo.style.position = 'relative';
		divFundo.style.width = '100%';
		divFundo.style.borderBottom = '1px solid #AAAAAA';

		divTexto.style.position = 'relative';
		divTexto.style.boxSizing = 'border-box';
		divTexto.style.width = '100%';
		divTexto.style.textAlign = 'left';

		divEspaco.style.display = 'inline-block';
		divEspaco.style.width = '132px';
		divEspaco.style.height = '3.5rem';
		
		mNome.style.display = 'inline-block';
		mNome.style.fontWeight = 'bold';
		mNome.style.fontSize = '1.6rem';
		mNome.style.verticalAlign = 'top';
		mNome.style.padding = '0.68rem 1.5rem';

		mDescricao.style.display = 'block';
		mDescricao.style.fontSize = '0.96rem';
		mDescricao.style.textAlign = 'left';
		mDescricao.style.padding = '0.68rem 1.5rem 1.5rem';

		mAvatar.style.display = 'block';
		mAvatar.style.position = 'absolute';
		mAvatar.style.maxWidth = '128px';
		mAvatar.style.top = '7.2rem';
		mAvatar.style.transform = 'translate(15%, -60%)';
		mAvatar.style.zIndex = '2';

		mAvatar.renderizar(estado);
		mNome.renderizar(estado);
		mDescricao.renderizar(estado);

    }
}

window.customElements.define('m-cartao-de-visita', MCartaoDeVisita);