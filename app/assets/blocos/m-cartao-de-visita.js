import MalocaElement from "./MalocaElement.js"; // ver como essa importação se comporta no cliente

class MCartaoDeVisita extends MalocaElement {
    constructor() {
        
        let html = `
        <div class="bloco">

			<slot></slot>

			<style>
            .bloco {
                box-sizing: border-box;
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

		divCartao.style.height = '15rem';
		divCartao.style.position = 'relative';

		divFundo.style.backgroundImage = `url('${estado.urlServidor}/${estado.view.tipo}s/${estado.view.id}/objetos/fundo')`;
		divFundo.style.display = 'block';
		divFundo.style.position = 'relative';
		divFundo.style.height = '50%';
		divFundo.style.width = '100%';
		divFundo.style.borderBottom = '1px solid #AAAAAA';

		divTexto.style.position = 'relative';
		divTexto.style.boxSizing = 'border-box';
		divTexto.style.display = 'grid';
		divTexto.style.height = '50%';
		divTexto.style.width = '100%';
		divTexto.style.padding = '1rem 0.5rem';
		divTexto.style.gridTemplateColumns = '180px 1fr';

		mAvatar.style.display = 'block';
		mAvatar.style.position = 'absolute';
		mAvatar.style.maxWidth = '128px';
		mAvatar.style.top = '50%';
		mAvatar.style.transform = 'translate(25%, -60%)';
		mAvatar.style.zIndex = '2';

		mNome.style.fontWeight = 'bold';
		mNome.style.fontSize = '2rem';
		mNome.style.alignSelf = 'end';
		mNome.style.justifySelf = 'center';
		mNome.style.paddingBottom = '0.42rem';
		mNome.style.textAlign = 'center';

		mDescricao.style.textAlign = 'left';
		mDescricao.style.alignSelf = 'end';
		mDescricao.style.paddingBottom = '0.68rem';

		mAvatar.renderizar(estado);
		mNome.renderizar(estado);
		mDescricao.renderizar(estado);

    }
}

window.customElements.define('m-cartao-de-visita', MCartaoDeVisita);