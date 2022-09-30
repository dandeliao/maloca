const urlApi = 'http://localhost:4000';

export async function serverFetch (caminho, metodo, dados) {
	
	let requestObject = {
		method: metodo,
		withCredentials: true,
		credentials: 'include',
	}

	if (dados) {
		requestObject.headers = { 'Content-Type': 'application/json' };
		requestObject.body = JSON.stringify(dados)
	}

	return await fetch(`${urlApi}${caminho}`, requestObject);
					/* .then(res => {
						if (res.ok) {
							return res;
						} else if(res.status === 404) {
							return Promise.reject(new Error('404'));
						} else if (res.status === 401) {
							return Promise.reject(new Error('401'));
						} else {
							return Promise.reject(new Error('Erro: ' + res.status));
						}
					}); */
}

export async function putPagina(estado, texto) {
	let paginaAtual = estado.view.paginas.find(pag => pag.id === estado.view.paginaAtiva);
	let dadosAtualizadosPagina = {
		titulo:             paginaAtual.titulo,
		publica:            paginaAtual.publica,
		html:               texto
	}
	return await serverFetch(`/pessoas/${estado.auth.id}/${paginaAtual.id}`, 'PUT', dadosAtualizadosPagina)
		/* .then(res => {
			if (res.status !== 200) { // status diferente de 200 != ok
				alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
				return null;
			}
		}); */
}

export async function cadastrar(form) {

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

export async function entrar(form) {

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