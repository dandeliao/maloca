import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(params) {
		super(params);
		this.setTitle('boas-vindas');
	}

	async getHtml () {
		const arquivo = await fetch(`http://localhost:4200/assets/views/html/boasVindas.html`);
		return arquivo.text();
	}

	estado() {
		const novoEstado = {
			tipo: 				'boasVindas',
			id:	  				0,
			pagina:				0,
			titulo: 			'boas-vindas',
			modosHabilitados:	[],
			modoAtivo:			'boas-vindas',
			esquemaDeCores:		'rosa-claro'
		}

		return novoEstado;
	}

	async cadastrar(form) {

		const urlApi = 'http://localhost:4000';
		if (form.elements['senha'].value === form.elements['senha2'].value) {
			const dados = {
				pessoa_id: form.elements['nome'].value,
				nome: form.elements['nome'].value,
				email: form.elements['email'].value,
				senha: form.elements['senha'].value
			}

			fetch(`${urlApi}/autenticacao/registro`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true,
				credentials: 'include',
				body: JSON.stringify(dados)
			}).then(res => {
				if (res.status === 201) { // status 201 = criado
					form.reset();
					alert('Registrade com sucesso! Agora é só fazer o login :)');
				} else {
					alert('Desculpe, aconteceu um erro ao fazer seu registro. Tente novamente');
				}
			});
		} else {
			alert('As senhas digitadas são diferentes');
		}
		form.reset();
	}

	async entrar(form) {
		const urlApi = 'http://localhost:4000';
		const dados = {
			pessoa_id: form.elements['nome'].value,
			senha: form.elements['senha'].value
		}

		let res = await fetch(`${urlApi}/autenticacao/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true,
			credentials: 'include',
			body: JSON.stringify(dados)
		});

		if (res.ok) { // pessoa foi autenticada com sucesso
			return true;
		} else { // erro no login
			return false;
		}
	}
}