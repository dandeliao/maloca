import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		if (params.nome) {
			this.setTitle(params.nome);	
		} else {
			this.setTitle('pessoa');
		}
		
	}

	async getHtml () {
		// provisório. Deve fazer fetch da pessoa no servidor da API
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/pessoa.html`);
		return arquivo.text();
	}
}