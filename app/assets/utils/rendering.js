import { serverFetch } from "./fetching.js";

export function togglePressed (imgButton) {
	if (imgButton.pressed) {
		imgButton.pressed = false;
	} else {
		imgButton.pressed = true;
	}
}

export async function renderNavBar(estado) {

	let navBar = document.getElementById('nav-bar');

	// determina os modos habilitados e o título a ser exibido na navBar
	let titulo = 'maloca';
	switch (estado.view.tipo) {
		case 'comunidade':
			estado.modos = ['ver', 'menu', 'inicio', 'clonar', 'info'];
			titulo = estado.view.id ? estado.view.id : 'maloca';
			break;
		case 'pessoa':
			estado.modos = ['ver', 'menu', 'inicio', 'clonar', 'info'];
			if (estado.auth.id === estado.view.id) {
				estado.modos.push('editar');
			}
			titulo = estado.view.id;
			break;
		case 'colecao':
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

				// temporário até implementar comunidades no servidor. Deverá ser mais parecido com o case 'pessoa'
				if (logade) {
					estado.auth.logade = true;
					estado.auth.id = (dadosPessoa.pessoa_id);
				} else {
					throw new Error('401');
				}
				
				if (estado.href === '/') {
					html = await fetch('http://localhost:4200/assets/views/inicio.html');
				} else {
					html = await fetch('http://localhost:4200/assets/views/comunidade.html');
				}
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

			case 'colecao':
				
			
				
				html = await fetch('http://localhost:4200/assets/views/colecao.html');
				
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