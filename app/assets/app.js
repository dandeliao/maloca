/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { navigateTo } from './utils/navigation.js';
import { rotas, router } from './utils/routing.js';

// history api listener
window.addEventListener('popstate', () => {
    router(rotas);
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', () => {

    let navBar = document.querySelector('nav-bar');
    navBar.render(estado);

    // captura o clique em links e elementos internos
    document.body.addEventListener('click', e => {

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
                    break;
                case 'inicio':
                    navigateTo('/', router, rotas);
                    break;
                case 'editar':
                    // toggle modo editar (view incluindo editor html)
                    console.log('abrir editar');
                    break;
                case 'clonar':
                    // abre clonar (modal?)
                    console.log('abrir clonar');
                    break;
                case 'info':
                    // abre info (modal?)
                    console.log('abrir info');
                    break;
                default:
                    console.log('mudar esquema de cores?')
            }    
        }
    });

    //let view = router(rotas);
    router(rotas);
});