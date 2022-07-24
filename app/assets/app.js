/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { navigateTo } from './utils/navigation.js';
import { rotas, router } from './utils/routing.js';
import { estadoInicial, getState, setState} from './utils/state.js';
import { togglePressed } from './utils/rendering.js';

// history api listener
window.addEventListener('popstate', () => {
    router(rotas);
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', () => {

    setState(estadoInicial);

    // captura o clique em links internos
    document.body.addEventListener('click', e => {

        let estado = getState();

        // captura clique em data-links
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

        switch (e.target.id) {
            case 'menu':
                // toggle barra lateral
                console.log('abrir menu');
                estado.modoAtivo = 'menu';
                togglePressed(e.target);
                break;
            case 'inicio':
                // abre view da página inicial da maloca
                navigateTo('/', router, rotas);
                estado.modoAtivo = 'ver';
                break;
            case 'editar':
                // toggle modo editar (view incluindo editor html)
                console.log('abrir editar');
                estado.modoAtivo = 'editar';
                togglePressed(e.target);
                break;
            case 'clonar':
                // abre clonar (modal?)
                console.log('abrir clonar');
                estado.modoAtivo = 'clonar';
                togglePressed(e.target);
                break;
            case 'info':
                // abre info (modal?)
                console.log('abrir info');
                estado.modoAtivo = 'info';
                togglePressed(e.target);
                break;
            default:
                estado.modoAtivo = 'ver';
                console.log('mudar esquema de cores?')
        }

        setState(estado);

    });

    router(rotas);
});