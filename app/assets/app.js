/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { navigateTo } from './utils/navigation.js';
import { rotas, router } from './utils/routing.js';
import { estadoInicial, getState, setState} from './utils/state.js';
import { renderNavBar, renderTabBar } from './utils/rendering.js';

const urlApi = 'http://localhost:4000';

// history api listener
window.addEventListener('popstate', () => {
    router(rotas);
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', () => {

    setState(estadoInicial);

    // captura o clique em links internos
    document.body.addEventListener('click', e => {
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

        let viewer = document.querySelector('#viewer');
        viewer.contentEditable = false;
        switch (estado.modoAtivo) {
            case 'ver':
                break;
            case 'menu':
                // toggle barra lateral
                console.log('abrir menu');

                // provisoriamente logout com clique no menu. Quando implementar barra ou modal com opções do menu, uma delas será o logout.
                fetch(`${urlApi}/autenticacao/logout`, {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'include'
                }).then(res => {
                    estado.meuId = '';
                    estado.modoAtivo = 'ver';
                    navigateTo('/', router, rotas);
                });
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

                viewer.innerText = viewer.innerHTML; // mostra tags html para edição
                viewer.contentEditable = true; // habilita edição
                viewer.focus()

                viewer.addEventListener('blur', ev => { // evento 'blur' dispara quando elemento perde o foco

                    let paginaAtual = estado.paginas.find(pag => pag.id == estado.paginaAtiva);
                    let dadosAtualizadosPagina = {
                        titulo:             paginaAtual.titulo,
                        publica:            paginaAtual.publica,
                        html:               viewer.innerText
                    }

                    fetch(`${urlApi}/pessoas/${estado.meuId}/${paginaAtual.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true,
                        credentials: 'include',
                        body: JSON.stringify(dadosAtualizadosPagina)
                    }).then(res => {
                        if (res.status === 200) { // status 200 = ok
                            
                            /* // desliga a edição da view
                            viewer.contentEditable = false;

                            // navega para a página, para renderizar view
                            navigateTo(location.pathname, router, rotas); */

                        } else {
                            alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
                            return null;
                        }
                    });
                });

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
        renderTabBar(estado);

    });

    let tabBar = document.getElementById('tab-bar');
    tabBar.addEventListener('click', e => {

        let estado = getState();
        e.preventDefault();

        let insideTarget = e.composedPath()[0]; // esse é o target verdadeiro dentro da shadow root. Útil para indicar, por exemplo, um clique no "X" (deletar) em modo edição

        let abaClicada = estado.paginaAtiva; // abaClicada inicialmente indica a aba que já está ativa. Importante caso o target não seja uma aba ou caso a criação de nova aba falhe
        if (e.target.id === 'nova-pagina') { // no modo edição um clique na aba "+" cria nova página
            console.log('botao de nova pagina clicado');
            const dadosNovaPagina = {
                pessoa_id: estado.meuId,
				titulo: 'nova-pagina',
				publica: true,
				html: ''
			}
            fetch(`${urlApi}/pessoas/${estado.meuId}/paginas`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true,
				credentials: 'include',
				body: JSON.stringify(dadosNovaPagina)
			}).then(res => {
				if (res.status === 201) { // status 201 = criado
                    return res.json();
                } else {
					alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
                    return null;
				}
            }).then(r => {
                console.log('dados da resposta:', r);

                if (r) {
                    abaClicada = r.pagina_pessoal_id;
                }
                    
                // atualiza estado com a nova página
                estado.paginaAtiva = abaClicada;
                setState(estado);
                // renderiza abas
                renderTabBar(estado);
                // navega para a página
                navigateTo(location.pathname, router, rotas);

            });

            /* if (dadosResposta) { // caso tenha tido sucesso ao criar nova página
                abaClicada = dadosResposta.pagina_pessoal_id;
            } */

        } else { // encontra aba clicada entre as páginas possíveis no estado atual, e então atribui o id dessa página à variável abaClicada

            if (e.target.pageId) {
                if (insideTarget.getAttribute('id') === 'delete') { // clique no botão "deletar página"
                    console.log('deletar página');
                    // aviso perguntando se a pessoa tem certeza
                    // caso confirme
                    //  -> caso sucesso
                    //      -> fazer fetch delete e renderizar novamente, mudando abaClicada para a primeira da lista
                    fetch(`${urlApi}/pessoas/${estado.meuId}/${e.target.pageId}`, {
                        method: 'DELETE',
                        withCredentials: true,
                        credentials: 'include',
                    }).then(res => {
                        if (res.status === 204) { // status 204 = recurso não encontrado (deletou com sucesso)
                            
                            // deleta página da lista de páginas no estado
                            let indicePagDeletada;
                            for (let i = 0; i < estado.paginas.length; i++) {
                                if (estado.paginas[i].id == e.target.pageId) {
                                    indicePagDeletada = i;
                                }
                            }
                            if (indicePagDeletada) {
                                estado.paginas.splice(indicePagDeletada, 1);
                            }

                            // muda aba ativa ('clicada') para primeira página disponível, se a atual tiver sido deletada
                            if (indicePagDeletada === estado.paginaAtiva) {
                                abaClicada = estado.paginas[0].id;
                            }
                                
                            // renderiza abas
                            renderTabBar(estado);
                            // navega para a página
                            //navigateTo(location.pathname, router, rotas);
                            
                        } else {
                            alert('Aconteceu um erro ao deletar a página. Por favor, tente novamente');
                            return null;
                        }
                    });
                    //  -> caso fracasso
                    //      -> exibir aviso com mensagem de erro recebida
                    // caso cancele, prosseguir sem deletar
                } else if (insideTarget.getAttribute('id') === 'editTitle') { // clique no botão "editar título da página"
                    console.log('editar título');
                    // criar elemento de edição de texto com conteúdo igual ao título atual
                    // sobrepor elemento ao botão que contém o título (append na página e position absolute no mesmo lugar onde está o título-botão "main"?)
                    // adicionar event listener (um para enter e um para clique em qualquer lugar da página?)
                    //  -> faz fetch put editando o título
                    //      -> caso sucesso
                    //          -> renderiza novamente, mudando abaClicada para a que foi editada
                    //      -> caso fracasso
                    //          -> exibe aviso com mensagem de erro recebida
                } else {
                    abaClicada = estado.paginas.find(pag => pag.id == e.target.pageId).id;
                }

                

            }

            if (e.target.pageId !== estado.paginaAtiva) {
                // atualiza estado com a nova página
                estado.paginaAtiva = abaClicada;
                setState(estado);
                // renderiza abas
                renderTabBar(estado);
                // navega para a página
                navigateTo(location.pathname, router, rotas);
            }
        }
        
        /* // atualiza estado com a nova página
        estado.paginaAtiva = abaClicada;
        setState(estado);

        // renderiza abas
        renderTabBar(estado);

        // navega para a página
        navigateTo(location.pathname, router, rotas); */
        
    });

    router(rotas);
                
});