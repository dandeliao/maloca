import { serverFetch, urlApi } from "./fetching.js";

// Converte um blob (ex: imagem) em uma string base64
function convertBlobToBase64(blob) {
	return new Promise((resolve, reject) => {
	  const reader = new FileReader();
	  reader.onerror = reject;
	  reader.onload = () => {
		resolve(reader.result);
	  };
	  reader.readAsDataURL(blob);
	});
}

export function togglePressed (imgButton) {
	if (imgButton.pressed) {
		imgButton.pressed = false;
	} else {
		imgButton.pressed = true;
	}
}

export async function renderMenu(estado) {

	let menu = document.createElement('maloca-menu');
	
	if (estado.auth.id) {
		let res = await serverFetch(`/pessoas/${estado.auth.id}`);
		let perfil = await res.json();
	
		let fetchedImage = await serverFetch(`/pessoas/${estado.auth.id}/objetos/avatar`, 'GET');
		let imageBase64 = await convertBlobToBase64(await fetchedImage.blob());
		menu.addProfile(imageBase64, perfil.nome);
		menu.addItem('Meu perfil', `/pessoa/${estado.auth.id}`);
	} else {
		menu.addProfile(`/assets/images/avatar.jpg`, 'pessoa não logada');
	}
	
	
	menu.addItem('Início', '/');
	menu.addItem('Coleções', '/colecoes');
	menu.addItem('Configuração', '/configuracao');
	menu.addItem('Sair', '/logout');

	menu.style.position = 'fixed';
	menu.style.zIndex = 500;
	menu.style.top = '2rem';
	menu.style.left = '0px';
	menu.style.width = '22rem';
	menu.style.maxWidth = '300px';
	menu.style.minWidth = '100px';

	document.body.appendChild(menu);

}

export async function renderNavBar(estado) {

	let navBar = document.getElementById('nav-bar');

	// determina os modos habilitados e o título a ser exibido na navBar
	let titulo = 'maloca';
	switch (estado.view.tipo) {
		case 'comunidade':
			let res = await serverFetch(`/pessoas/${estado.auth.id}/objetos/comunidades?id=maloca`);
			let habilidades = (await res.json())[0];
			estado.modos = ['ver', 'menu', 'inicio', 'clonar', 'info'];
			if (habilidades.editar) {
				estado.modos.push('editar');
			}
			titulo = estado.view.id ? estado.view.id : 'maloca';
			break;
		case 'pessoa':
			estado.modos = ['ver', 'menu', 'inicio', 'clonar', 'info'];
			if (estado.auth.id === estado.view.id) {
				estado.modos.push('editar');
			}
			titulo = estado.view.id;
			break;
		case 'colecoes':
		case 'configuracao':
		case 'erro':
			estado.modos = ['ver', 'menu', 'inicio'];
			titulo = estado.view.tipo;
			break;
		default:
			estado.modos = ['ver'];
	}

	// renderiza o título da navBar
	let elTitulo = navBar.querySelector('#view-title');
	elTitulo.innerText = titulo;

	// renderiza o estilo. A fazer: criar css completo para cada estilo
	switch (estado.estilo) {
		case 'padrao':
			navBar.style.backgroundColor = '#ffb6c1';
			navBar.style.color = '#1B1B1B';
			break;
		case 'noturno':
			navBar.style.backgroundColor = '#674e48';
			navBar.style.color = '#EFEFEF';
			break;
	}

	// renderiza os botões (ícones)
	let btns = navBar.querySelectorAll('img-button');
	btns.forEach(b => {

		if (estado.modoAtivo === b.id) {
			b.pressed = true;
		} else {
			b.pressed = false;
		}

		let habilitado = false;
		estado.modos.forEach(m => {
			if (m === b.id) {
				habilitado = true;
			}
		});
		b.enabled = habilitado;

	});

	return {
		resultado: 'rendered',
		estado: estado
	};
}

export async function renderTabBar (estado) {

    let tabBar = document.getElementById('tab-bar');

	while (tabBar.lastChild) {
		tabBar.removeChild(tabBar.lastChild);
	}

    if ((estado.view.tipo === 'pessoa') || (estado.view.tipo === 'comunidade')) { // caso seja view com páginas (pessoais ou comunitárias), exibe abas
        
		tabBar.classList.add('active');

		if (estado.view.paginas) {
			estado.view.paginas.forEach(p => {
				let mtab = document.createElement('maloca-tab');
				mtab.texto = p.titulo;
				mtab.pageId = p.id;
				if (p.id === estado.view.paginaAtiva) {
					mtab.selected = true;
				}
				tabBar.appendChild(mtab);
			});
		} else {
			//alert('Não foram encontradas páginas para esse endereço. Tente entrar novamente.');
		}
		

		if (estado.modoAtivo === 'editar') {
			// exibe "X" em cada aba, o que permite deletar aba
			for (let i = 0; i < tabBar.children.length; i++) {
				tabBar.children[i].modoEditar = true;
			}
			// cria e exibe aba "+" que permite criar nova página
			let mtabPlus = document.createElement('maloca-tab');
			mtabPlus.texto = '+';
			mtabPlus.setAttribute('id', 'nova-pagina');
			tabBar.appendChild(mtabPlus);
		}

    } else {
        // caso contrário, oculta abas
        tabBar.classList.remove('active');
    }

	return {
		resultado: 'rendered',
		estado: estado
	};
}

export async function renderBlocos (estado) {
	let viewer = document.querySelector('#viewer');
	let listaBlocos = viewer.shadowRoot.querySelectorAll('m-comunidades');
	console.log('listaBlocos:', listaBlocos);
	listaBlocos.forEach(bloco => {
		bloco.renderizar(estado, urlApi);
	});
}

export async function renderView (estado) {

	try {

		// verifica se a pessoa está logada e armazena dados de autenticação na variável estado
		let logade = false;
		let res = await serverFetch('/', 'GET');
		let dadosPessoa = await res.json();
		if (dadosPessoa.logade) { // está logada
			logade = true;
		} else { // não está logada
			logade = false;
		}

		let html = '';
		switch (estado.view.tipo) {
			
			case 'comunidade':

				if (logade) {
					estado.auth.logade = true;
					estado.auth.id = (dadosPessoa.pessoa_id);
				} else {
					throw new Error('401');
				}
				
				/* // temporário até implementar comunidades no servidor. Deverá ser mais parecido com o case 'pessoa'
				if (estado.href === '/') {
					html = await fetch('http://localhost:4200/assets/views/inicio.html');
				} else {
					html = await fetch('http://localhost:4200/assets/views/comunidade.html');
				} */

				// se não encontrar no estado, solicita ao servidor a lista de páginas, armazena na variável de estado e seleciona a primeira como página ativa
				if ((!estado.view.paginas) || (!estado.view.paginaAtiva)) {
					res = await serverFetch(`/comunidades/${estado.view.id}/paginas`, 'GET');
					switch (res.status) {
						case 404:	throw new Error('404');	break;
						case 401:	throw new Error('401'); break;
					}
					let pages = await res.json();
					if (pages.length > 0) {
						estado.view.paginas = [];
						pages.forEach(p => {
							estado.view.paginas.push({
								id: p.pagina_comunitaria_id,
								titulo: p.titulo,
								publica: p.publica,
								criacao: p.criacao
							});
						});
					} else { // se não há páginas no servidor
						if (estado.auth.id === estado.view.id) { // e se a pessoa logada é a dona do perfil acessado
							// insere uma página padrão no servidor e a carrega no estado
							let paginaNova = {
								titulo: 'nova página',
								publica: true,
								html: '<h2>Minha primeira página</h2><br><p>site em construção...</p>'
							};
							res = await serverFetch(`/comunidades/${estado.view.id}/paginas`, 'POST', paginaNova);
							if (res.status === 201) { // 201 = página criada com sucesso
								let paginaCriada = await res.json();
								estado.view.paginas = [];
								estado.view.paginas.push({
									id: paginaCriada.pagina_comunitaria_id,
									titulo: paginaCriada.titulo,
									publica: paginaCriada.publica,
									criacao: paginaCriada.criacao
								});
							}	
						}
					}
					estado.view.paginaAtiva = estado.view.paginas[0].id;
				}
				
				// faz pedido da página ativa
				html = await serverFetch(`/comunidades/${estado.view.id}/${estado.view.paginaAtiva}`, 'GET');
				break;

				break;

			case 'pessoa':

				if (logade) {
					estado.auth.logade = true;
					estado.auth.id = (dadosPessoa.pessoa_id);
				} else {
					throw new Error('401');
				}
				
				// se não encontrar no estado, solicita ao servidor a lista de páginas, armazena na variável de estado e seleciona a primeira como página ativa
				if ((!estado.view.paginas) || (!estado.view.paginaAtiva)) {
					res = await serverFetch(`/pessoas/${estado.view.id}/paginas`, 'GET');
					switch (res.status) {
						case 404:	throw new Error('404');	break;
						case 401:	throw new Error('401'); break;
					}
					let pages = await res.json();
					if (pages.length > 0) {
						estado.view.paginas = [];
						pages.forEach(p => {
							estado.view.paginas.push({
								id: p.pagina_pessoal_id,
								titulo: p.titulo,
								publica: p.publica,
								criacao: p.criacao
							});
						});
					} else { // se não há páginas no servidor
						if (estado.auth.id === estado.view.id) { // e se a pessoa logada é a dona do perfil acessado
							// insere uma página padrão no servidor e a carrega no estado
							let paginaNova = {
								titulo: 'nova página',
								publica: true,
								html: '<h2>Minha primeira página</h2><br><p>site em construção...</p>'
							};
							res = await serverFetch(`/pessoas/${estado.view.id}/paginas`, 'POST', paginaNova);
							if (res.status === 201) { // 201 = página criada com sucesso
								let paginaCriada = await res.json();
								estado.view.paginas = [];
								estado.view.paginas.push({
									id: paginaCriada.pagina_pessoal_id,
									titulo: paginaCriada.titulo,
									publica: paginaCriada.publica,
									criacao: paginaCriada.criacao
								});
							}	
						}
					}
					estado.view.paginaAtiva = estado.view.paginas[0].id;
				}
				
				// faz pedido da página ativa
				html = await serverFetch(`/pessoas/${estado.view.id}/${estado.view.paginaAtiva}`, 'GET');
				break;

			case 'boasVindas':

				if (logade) {
					throw new Error('autenticade');
				} else {
					estado.auth.logade = false;
					estado.auth.id = null;
					html = await fetch(`http://localhost:4200/assets/views/boasVindas.html`);
				}
				
				break;

			case 'colecoes':

				if (logade) {
					estado.auth.logade = true;
					estado.auth.id = (dadosPessoa.pessoa_id);
				} else {
					throw new Error('401');
				}
				
				html = await fetch('http://localhost:4200/assets/views/colecoes.html');
				
				break;

			case 'configuracao':
				
				if (logade) {
					estado.auth.logade = true;
					estado.auth.id = (dadosPessoa.pessoa_id);
				} else {
					throw new Error('401');
				}
				
				html = await fetch('http://localhost:4200/assets/views/configuracao.html');
				
				break;
			
			case 'erro':

				html = await fetch('http://localhost:4200/assets/views/404.html');
				break;


		}

		// renderiza view
		document.querySelector("#viewer").html = await html.text();
		
		renderBlocos(estado);

		return {
			resultado: 'rendered',
			estado: estado
		};


	} catch (erro) {
		if (erro.message === '401') { // não está logade
			return { resultado: '401', estado: estado };
		} else if (erro.message === 'autenticade') { // está logade (é erro no caso de acesso à tela de boas-vindas)
			return { resultado: 'autenticade', estado: estado };
		} else {
			return { resultado: 'failed', estado: estado };
		}
	}
}