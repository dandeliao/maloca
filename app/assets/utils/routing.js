import { pathToRegex, getParams, navigateTo } from "./navigation.js";
import { renderNavBar, renderView } from "./rendering.js";
import { getState, setState } from "./state.js";

// importa views
import Inicio from '../views/js/Inicio.js';
import BoasVindas from "../views/js/BoasVindas.js";
import Colecao from "../views/js/Colecao.js";
import Configuracao from "../views/js/Configuracao.js";
import Pessoa from "../views/js/Pessoa.js";
import Comunidade from "../views/js/Comunidade.js";
import Error404 from "../views/js/404.js";

// array de rotas, com suas respectivas views
export const rotas = [
	{ path: '/', view: Inicio},
	{ path: '/boasvindas', view: BoasVindas},
	{ path: '/colecao', view: Colecao},
	{ path: '/configuracao', view: Configuracao},
	{ path: '/pessoa/:nome', view: Pessoa},
	{ path: '/:nome', view: Comunidade}
];

// direciona as rotas do app
export async function router(routes) {

    // Testa se as rotas correspondem ao caminho atual da barra de endereços
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path)) // retorna objeto com caminho e parâmetros capturados via regex
        };
    });

    let match = potentialMatches.find(potMatch => potMatch.result !== null);

    if (!match) {
        match = {
            route: { path: "/404", view: Error404},
            result: [location.pathname]
        };
    }

    // cria e renderiza view
    let view;
    let renderResult = '';
    while(renderResult !== 'rendered') {
        view = new match.route.view(getParams(match));
        renderResult = await renderView(view);
        if (renderResult === '401') {
            match = {
                route: { path: "/boasVindas", view: BoasVindas},
                result: [location.pathname]
            };
        } else if (renderResult === 'failed') {
            match = {
                route: { path: "/404", view: Error404},
                result: [location.pathname]
            };
        }
    }

    let novoEstado = view.estado(getState());

    // caso seja a tela de boas-vindas, ativa formulários
    if (novoEstado.tipo === 'boasVindas') {
        
        let formCadastro = document.getElementById('form-cadastro');
        formCadastro.addEventListener('submit', e => {
            e.preventDefault();
            view.cadastrar(formCadastro);
        });

        let formLogin = document.getElementById('form-login');
        formLogin.addEventListener('submit', e => {
            e.preventDefault();
            view.entrar(formLogin)
                .then(entrou => {
                    if (entrou) { // se o login teve sucesso, redireciona para view inicial
                        navigateTo('/', router, rotas);
                    } else {
                        alert('Erro ao entrar :( tente novamente');
                    }
                })
        });
    }

    // atualiza estado
    setState(novoEstado);

    // renderiza barra
    renderNavBar(getState());

    return view;
}