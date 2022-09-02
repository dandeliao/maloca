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
		
		// falta verificar se página existe, se é pública etc...

		// se a página atual não está definida, solicita ao servidor a lista de páginas e seleciona a primeira como a atual
		if (!this.params.pagina) {
			const paginas = await this.getPaginas();
			this.params.pagina = paginas[0].pagina_pessoal_id;
		}

		// faz pedido da página
		const html = await fetch(`http://localhost:4000/pessoas/${this.params.nome}/${this.params.pagina}`, {
			method: 'GET',
			withCredentials: true,
			credentials: 'include'
		})
		.then(res => {
			if (res.ok) {
				return res;
			} else if(res.status === 404) {
				return Promise.reject(new Error('404'));
			} else if (res.status === 401) {
				return Promise.reject(new Error('401'));
			} else {
				return Promise.reject(new Error('Erro: ' + res.status));
			}
		});

		return html.text();
	}

	async getPaginas () {
		// solicita ao servidor a lista de páginas da pessoa
		const paginas = await fetch(`http://localhost:4000/pessoas/${this.params.nome}/paginas`, {
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

		return paginas;
	}

	get pagina() {
		return this.params.pagina;
	}

	set pagina(p) {
		this.params.pagina = p;
	}

	async estado (velhoEstado) {

		let paginasSimples = [];
		const paginasCompletas = await this.getPaginas();
		for(let i = 0; i < paginasCompletas.length; i++) {
			paginasSimples.push({
				id: paginasCompletas[i].pagina_pessoal_id,
				titulo: paginasCompletas[i].titulo,
				publica: paginasCompletas[i].publica
			});
		}

		let paginaAtual = 1;
		if (this.params.pagina) {
			paginaAtual = this.params.pagina;
		} else if (paginasSimples[0]) {
			paginaAtual = paginasSimples[0].id;
		}

		this.params.pagina = paginaAtual;

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

		let modos = ['menu', 'inicio', 'clonar', 'info'];			
		if (minhaArroba === paginasCompletas[0].pessoa_id) {
			modos.push('editar');
		}

		const novoEstado = {
			meuId:				minhaArroba,
			tipo: 				'pessoa',
			titulo: 			this.params.nome,
			id:	  				this.params.nome,
			paginas:			paginasSimples,
			paginaAtiva:		paginaAtual,
			modosHabilitados:	modos,
			modoAtivo:			velhoEstado.modoAtivo,
			esquemaDeCores:		velhoEstado.esquemaDeCores
		}

		return novoEstado;
	}
}