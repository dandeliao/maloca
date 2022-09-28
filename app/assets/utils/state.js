import { renderNavBar, renderTabBar, renderView } from "./rendering.js";
import { router } from "./routing.js";
import { serverFetch, cadastrar, entrar } from "./fetching.js"

const urlCliente = 'http://localhost:4200';

export const estadoPadrao = {
	href:		'/boas-vindas',
	modos:		['ver'],
	modoAtivo:	'ver',
	estilo:		'padrao',
	auth:	{
		logade:		false,
		id:			null,
	},
	view:	{
		tipo:		'boasVindas',
		id:			null,
		paginas: 	null,
		paginaAtiva: null,
	}
}

export function getState() {
	return JSON.parse(localStorage.getItem('estado'));
}


export async function setState(estado, noPush) {

	const estadoVelho = getState();
	let renderData = null;

	// renderiza view. Só é chamado nos seguintes casos: 1) ainda não há estado armazenado, ou 2) o caminho foi alterado, ou 3) uma aba distinta foi clicada, ou 4) acabou de sair do modo editar
	if ((!estadoVelho) || (estadoVelho.href !== estado.href) || (estadoVelho.view.paginaAtiva !== estado.view.paginaAtiva) || ((estadoVelho.modoAtivo === 'editar') && (estadoVelho.modoAtivo !== estado.modoAtivo))) {
		
		// tenta renderizar a view. Dependendo da resposta, altera estado e tenta novamente.
		let renderResult = '';
		while(renderResult !== 'rendered') {
			
			// chama o router e retorna os dados básicos da view a ser renderizada
			let dadosDoRouter = await router(estado.href);
			
			// atualiza estado com o resultado do router
			estado.href = dadosDoRouter.href;
			estado.view.tipo = dadosDoRouter.tipo;
			estado.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
			
			// se foi mudança de view (e não apenas troca de aba ou mudança de modo), limpa as paginas do estado (para que as novas sejam obtidas do servidor na renderização)
			if ((!estadoVelho) || (estadoVelho.href !== estado.href)) {
				estado.view.paginas = null;
				estado.view.paginaAtiva = null;
			} else if ((estadoVelho.modoAtivo === 'editar') && (estadoVelho.modoAtivo !== estado.modoAtivo)) {
				// se foi saída do modo editar, envia os dados da página modificada para servidor (PUT)
			
				let viewer = document.querySelector('#viewer');
				let paginaAtual = estado.view.paginas.find(pag => pag.id === estado.view.paginaAtiva);
				let dadosAtualizadosPagina = {
					titulo:             paginaAtual.titulo,
					publica:            paginaAtual.publica,
					html:               viewer.text
				}

				serverFetch(`/pessoas/${estado.auth.id}/${paginaAtual.id}`, 'PUT', dadosAtualizadosPagina)
					.then(res => {

						viewer.contentEditable = false;
						estado.modoAtivo = 'ver';
						
						if (res.status !== 200) { // status diferente de 200 != ok
							alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
							return null;
						}
					});
			}
			
			// renderiza view
			renderData = await renderView(estado);
			renderResult = renderData.resultado;
			estado = renderData.estado; // atualiza estado com as modificações feitas na renderização

			// verifica possíveis erros na renderização
			if (renderResult === '401') { // tentou acessar recurso, mas não está autenticada. Redireciona para boas-vindas
				estado.href = '/boas-vindas';
				estado.auth.logade = false;
				estado.auth.id = null;
			} else if (renderResult === 'autenticade') { // tentou entrar em boas-vindas, mas já está autenticada. Redireciona para início
				estado.href = '/';
				noPush = true;
			} else if (renderResult === 'failed') { // outros erros redirecionam para 404
				estado.href = '/404';
			}
		}

		// após renderizar view, se o push não foi desabilitado por parâmetro, faz push na history API para salvar navegação e permitir que o navegador volte e avance páginas
		if (!noPush) {
			let url = urlCliente + estado.href;
			history.pushState(null, url, url);
		}
	}

	// renderiza barras
	renderData = await renderNavBar(estado);
	if (renderData.resultado === 'rendered') {
		estado = renderData.estado;
	}
	renderData = await renderTabBar(estado);
	if (renderData.resultado === 'rendered') {
		estado = renderData.estado;
	}

	// caso seja a tela de boas-vindas, ativa formulários
	if (estado.view.tipo === 'boasVindas') {
			
		let formCadastro = document.getElementById('form-cadastro');
		formCadastro.addEventListener('submit', async e => {
			e.preventDefault();
			cadastrar(formCadastro);
		});

		let formLogin = document.getElementById('form-login');
		formLogin.addEventListener('submit', async e => {
			e.preventDefault();
			entrar(formLogin)
				.then(entrou => {
					if (entrou) { // se o login teve sucesso
						estado.auth.logade = true;
						estado.auth.id = formLogin.elements['nome'].value;
						estado.href = '/';
						estado.view.tipo = 'comunidade';
						setState(estado);
					} else {
						alert('Erro ao entrar :( tente novamente');
					}
				})
		});
	}

	// grava o novo estado no armazenamento local
	localStorage.setItem('estado', JSON.stringify(estado));

}