import { pathToRegex, getParams } from "./navigation.js";

// importa views
import Inicio from '../views/js/Inicio.js';
import BoasVindas from "../views/js/BoasVindas.js";
import Colecao from "../views/js/Colecao.js";
import Configuracao from "../views/js/Configuracao.js";
import Pessoa from "../views/js/Pessoa.js";
import Comunidade from "../views/js/Comunidade.js";

const urlCliente = 'http://localhost:4200';

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
    
    /* modelo para o parâmetro "routes":

	const routes = [
        { path: "/", view: Inicio},
        { path: "/painel", view: Painel},
        { path: "/pessoa/:nome", view: Pessoa},
        { path: "/:nome", view: Comunidade}
    ];
	
	*/

    // Testa se as rotas correspondem ao caminho atual
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potMatch => potMatch.result !== null);

    if (!match) {
        match = {
            route: { path: "/404", view: Error404},
            result: [location.pathname]
        };
    }

    const view = new match.route.view(urlCliente); // cria instância da view atual
    document.querySelector("#viewer").innerHTML = await view.getHtml(); // renderiza view
    return view;
}