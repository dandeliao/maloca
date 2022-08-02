import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('minhas comunidades');
	}

	async getHtml () {
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/colecao.html`);
		return arquivo.text();
	}
}