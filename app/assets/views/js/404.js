import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('404 - página não existe');
	}

	async getHtml () {
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/404.html`);
		return arquivo.text();
	}
}