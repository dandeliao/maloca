import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(urlCliente) {
		super({
			urlCliente:	urlCliente,
			view: 			'boasVindas'
		});
		this.setTitle('maloca - boas-vindas');
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

		fetch(`${urlApi}/autenticacao/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true,
			credentials: 'include',
			body: JSON.stringify(dados)
		})
		.then(res => res.json())
		.then(r => {
			if (r.autenticade) {
				console.log('autenticade! redirecionar para página inicial');
			} else {
				console.log('não autenticade >:(');
			}
			form.reset()
		});
	}
}