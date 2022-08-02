import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('comunidade X');
	}

	async getHtml () {
		// provisório. Deve fazer fetch da comunidade no servidor da API
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/comunidade.html`);
		return arquivo.text();
	}
}