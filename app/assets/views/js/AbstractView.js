export default class {
	constructor (params) {
		this.enderecoHtml = `${params.urlCliente}/assets/views/html/${params.view}.html`;
		this.params = params;
	}

	setTitle(title) {
		document.title = title;
	}

	async getHtml() {
		/* const arquivo = await fetch(this.enderecoHtml);
		return arquivo.text(); */
		return '';
	}

	estado(velhoEstado) {
		const estadoInicial = {
			tipo: 				'comunidade',
			id:	  				0,
			pagina:				0,
			titulo: 			'maloca (início)',
			modosHabilitados:	['menu', 'inicio'],
			modoAtivo:			'ver',
			esquemaDeCores:		velhoEstado.esquemaDeCores
		}

		return estadoInicial;
	}

}