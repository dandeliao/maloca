import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('configuração');
	}

	async getHtml () {
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/configuracao.html`);
		return arquivo.text();
	}
}