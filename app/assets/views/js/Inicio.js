import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('maloca');
	}

	async getHtml () {
		// provisório. Deve fazer fetch da página inicial da instância, não de /pessoas
		const arquivo = await fetch(`http://localhost:4000/pessoas`, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include'
		})
		.then(res => {
			if (res.ok) {
				return res.json();
			} else if(res.status === 404) {
				return Promise.reject(new Error('404'));
			} else if (res.status === 401) {
				return Promise.reject(new Error('401'));
			} else {
				return Promise.reject(new Error('Erro: ' + res.status));
			}
		});
			
		//return arquivo.text();
		let arquivoLocal = await fetch('http://localhost:4200/assets/views/html/inicio.html');
		return arquivoLocal.text();
	}

	estado () {
		const novoEstado = {
			tipo: 				'comunidade',
			id:	  				0,
			pagina:				0,
			titulo: 			'maloca (início)',
			modosHabilitados:	['menu', 'inicio', 'clonar', 'info'],
			modoAtivo:			'ver',
			esquemaDeCores:		'rosa-claro'
		}

		return novoEstado;
	}
}