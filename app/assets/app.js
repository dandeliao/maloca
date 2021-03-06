/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { navigateTo } from './utils/navigation.js';
import { rotas, router } from './utils/routing.js';
import { estadoInicial, getState, setState} from './utils/state.js';
import { renderNavBar } from './utils/rendering.js';

// history api listener
window.addEventListener('popstate', () => {
    router(rotas);
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', () => {

    setState(estadoInicial);
    renderNavBar(getState());

    // captura o clique em links internos
    document.body.addEventListener('click', e => {

        let estado = getState();

        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            if (e.target.href) {
                navigateTo(e.target.href, router, rotas);
            }
        }
    });

    // captura clique na barra de navegação
    let navBar = document.getElementById('nav-bar');
    navBar.addEventListener('click', e => {

        let estado = getState();
        e.preventDefault();

        // se o modo clicado já estiver ativo, desativa. Senão, ativa.
        if (estado.modoAtivo === e.target.id) {
            estado.modoAtivo = 'ver';
        } else {
            estado.modoAtivo = e.target.id;
        }

        switch (e.target.id) {
            case 'menu':
                // toggle barra lateral
                console.log('abrir menu');
                break;
            case 'inicio':
                // abre view da página inicial da maloca
                navigateTo('/', router, rotas);
                estado.modoAtivo = 'ver';
                break;
            case 'editar':
                // toggle modo editar (view incluindo editor html)
                console.log('abrir editar');
                break;
            case 'clonar':
                // abre clonar (modal?)
                console.log('abrir clonar');
                // se o modo já estiver ativo, desativa
                break;
            case 'info':
                // abre info (modal?)
                console.log('abrir info');
                break;
            default:
                estado.modoAtivo = 'ver';
                console.log('mudar esquema de cores?')
                if (estado.esquemaDeCores === 'rosa-claro') {
                    estado.esquemaDeCores = 'marrom-escuro';
                } else {
                    estado.esquemaDeCores = 'rosa-claro';
                }
        }

        setState(estado);
        renderNavBar(estado);

    });

    router(rotas);
});