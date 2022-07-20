export default class {
	constructor (params) {
		this.enderecoHtml = `${params.urlCliente}/assets/views/html/${params.view}.html`;
	}

	setTitle(title) {
		document.title = title;
	}

	async getHtml() {
		const arquivo = await fetch(this.enderecoHtml);
		return arquivo.text();
	}

}