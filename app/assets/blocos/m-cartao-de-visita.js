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
                box-shadow: var(--box-shadow, 3px 4px 10px rgba(0, 0, 0, 0.2));
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
		let mNome = document.createElement('m-nome');
		let mDescricao = document.createElement('m-descricao');

		divCartao.appendChild(divFundo);
		divTexto.appendChild(mNome);
		divTexto.appendChild(mDescricao);
		divCartao.appendChild(divTexto);
		divCartao.appendChild(mAvatar);

		this.style.display = 'block';

		divCartao.style.height = '18rem';
		divCartao.style.position = 'relative';

		divFundo.style.backgroundImage = `url('${estado.urlServidor}/${estado.view.tipo}s/${estado.view.id}/objetos/fundo')`;
		divFundo.style.display = 'block';
		divFundo.style.position = 'relative';
		divFundo.style.height = '40%';
		divFundo.style.width = '100%';
		divFundo.style.borderBottom = '1px solid #AAAAAA';

		divTexto.style.position = 'relative';
		divTexto.style.boxSizing = 'border-box';
		divTexto.style.display = 'grid';
		divTexto.style.height = '60%';
		divTexto.style.width = '100%';
		divTexto.style.gridTemplateColumns = '148px 1fr';
		divTexto.style.gridTemplateRows = '1fr 2fr';
		divTexto.style.overflow = 'auto';

		mAvatar.style.display = 'block';
		mAvatar.style.position = 'absolute';
		mAvatar.style.maxWidth = '128px';
		mAvatar.style.top = '40%';
		mAvatar.style.transform = 'translate(15%, -60%)';
		mAvatar.style.zIndex = '2';

		mNome.style.fontWeight = 'bold';
		mNome.style.fontSize = '1.6rem';
		mNome.style.alignSelf = 'start';
		mNome.style.justifySelf = 'left';
		mNome.style.padding = '0.68rem 1.5rem 0 0';
		mNome.style.gridColumnStart = '2';

		mDescricao.style.fontSize = '0.96rem';
		mDescricao.style.textAlign = 'left';
		mDescricao.style.alignSelf = 'start';
		mDescricao.style.padding = '0.6rem 1.5rem';
		mDescricao.style.gridColumnStart = '1';
		mDescricao.style.gridColumnEnd = '3';

		mAvatar.renderizar(estado);
		mNome.renderizar(estado);
		mDescricao.renderizar(estado);

    }
}

window.customElements.define('m-cartao-de-visita', MCartaoDeVisita);