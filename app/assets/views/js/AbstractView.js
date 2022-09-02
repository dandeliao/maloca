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


	async getPaginas() {
		return [];
	}

	get pagina() {
		return 1;
	}

	set pagina(p) {
		return p;
	}

	async estado(velhoEstado) {

		// faz fetch dos dados da pessoa logada
		const eu = await fetch(`http://localhost:4000/`, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include'
		}).then(res => {
			if (res.ok) {
				return res.json();
			} else {
				return null;
			}
		});
		const minhaArroba = eu.pessoa_id ? eu.pessoa_id : velhoEstado.meuId;

		const estadoInicial = {
			meuId:				minhaArroba,
			tipo: 				'comunidade',
			titulo: 			'maloca (início)',
			id:	  				0,
			paginas:			[],
			paginaAtiva:		null,
			modosHabilitados:	['menu', 'inicio'],
			modoAtivo:			'ver',
			esquemaDeCores:		velhoEstado.esquemaDeCores
		}

		return estadoInicial;
	}

}