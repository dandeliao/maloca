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
    
    // captura o clique em links para router
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            if (e.target.href) {
                navigateTo(e.target.href, router, rotas);
            /* } else {
                // para o caso de components m-link
                navigateTo(e.target.attributes.href.value); */
            }
        }
    });

    let view = router(rotas);

});