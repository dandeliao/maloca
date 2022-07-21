/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { navigateTo } from './utils/navigation.js';
import { rotas, router } from './utils/routing.js';
import { estadoInicial, getState, setState} from './utils/state.js';

window.addEventListener('popstate', () => {
// history api listener
    router(rotas);
});

document.addEventListener('DOMContentLoaded', () => {
// carregamento inicial

    setState(estadoInicial);

    let navBar = document.querySelector('nav-bar');
    navBar.render(getState());

    // captura o clique em links e elementos internos
    document.body.addEventListener('click', e => {

        console.log(e.target);
        let estado = getState();

        // captura clique em data-links
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            if (e.target.href) {
                navigateTo(e.target.href, router, rotas);
            /* } else {
                // para o caso de components m-link
                navigateTo(e.target.attributes.href.value); */
            }
        }

        // captura clique na barra de navegação
        if (e.target.matches('nav-bar')) {
            let action = navBar.shadowTarget(e);
            switch (action) {
                case 'menu':
                    // toggle barra lateral
                    console.log('abrir menu');
                    estado.modoAtivo = 'menu';
                    setState(estado);
                    break;
                case 'inicio':
                    navigateTo('/', router, rotas);
                    estado.modoAtivo = 'inicio';
                    setState(estado);
                    break;
                case 'editar':
                    // toggle modo editar (view incluindo editor html)
                    console.log('abrir editar');
                    estado.modoAtivo = 'editar';
                    setState(estado);
                    break;
                case 'clonar':
                    // abre clonar (modal?)
                    console.log('abrir clonar');
                    estado.modoAtivo = 'clonar';
                    setState(estado);
                    break;
                case 'info':
                    // abre info (modal?)
                    console.log('abrir info');
                    estado.modoAtivo = 'info';
                    setState(estado);
                    break;
                default:
                    console.log('mudar esquema de cores?')
            }    
        }

        console.log(getState());
        navBar.render(getState());

    });

    //let view = router(rotas);
    router(rotas);
});