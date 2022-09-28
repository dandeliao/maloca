/* nota: colocar sempre a extensão (.js) no final do nome dos arquivos,
       para que o servidor redirecione corretamente os imports. */
import { router } from './utils/routing.js';
import { estadoPadrao, getState, setState} from './utils/state.js';
import { serverFetch } from './utils/fetching.js';

const urlApi = 'http://localhost:4000';
const urlCliente = 'http://localhost:4200';

// history api listener
window.addEventListener('popstate', async () => {
    let dadosDoRouter = await router(location.pathname);
    let estado = getState();
    estado.href = dadosDoRouter.href;
    estado.view.tipo = dadosDoRouter.tipo;
    estado.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
    await setState(estado, 'noPush');
});

// carregamento inicial
document.addEventListener('DOMContentLoaded', async () => {

    // limpa estado armazenado de carregamento anterior
    localStorage.clear();

    // inicializa com a rota correspondente ao caminho da barra de endereços
    let estadoInicial = estadoPadrao;
    let dadosDoRouter = await router(location.pathname);
    estadoInicial.href = dadosDoRouter.href;
    estadoInicial.view.tipo = dadosDoRouter.tipo;
	estadoInicial.view.id = dadosDoRouter.params.nome ? dadosDoRouter.params.nome : null;
    await setState(estadoInicial);

    // captura o clique em links internos
    document.body.addEventListener('click', async e => {
        
        let estado = getState();
        
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            if (e.target.href) {
                estado.href = (e.target.href).replace(urlCliente, '');
                await setState(estado);
            }
        }
    });
            
    // captura clique na barra de navegação
    let navBar = document.getElementById('nav-bar');
    navBar.addEventListener('click', async e => {

        let estado = getState();
        e.preventDefault();

        // viewer permite renderizar modo editar, se for o caso.
        // levar estas duas linhas para dentro de rendering.js (?)
        let viewer = document.querySelector('#viewer');
        viewer.editable = false;
        // se o modo clicado já estiver ativo, desativa (muda para 'ver'). Senão, ativa.
        if (estado.modoAtivo === e.target.id) {
            estado.modoAtivo = 'ver';
        } else {
            switch (e.target.id) {
                case 'menu':
                    // toggle barra lateral
                    console.log('abrir menu');

                    // provisoriamente logout com clique no menu. Quando implementar barra ou modal com opções do menu, uma delas será o logout.
                    await serverFetch('/autenticacao/logout', 'GET');
                    
                    estado.auth.logade = false;
                    estado.auth.id = null;
                    estado.modoAtivo = 'ver'; // deverá ser 'menu'
                    estado.href = '/boas-vindas';
                    estado.view.tipo = 'boasVindas';
                    break;
                
                case 'inicio':
                    // abre view da página inicial da maloca
                    estado.modoAtivo = 'ver';
                    estado.href = '/';
                    break;
                
                case 'editar':
                    // toggle modo editar (view incluindo editor html)
                    estado.modoAtivo = 'editar';
                    
                    console.log('modo editar');
                    
                    // levar este trecho inteiro para dentro de rendering.js (?)
                    viewer.text = viewer.html; // mostra tags html para edição
                    viewer.editable = true; // habilita edição
                    viewer.focusOnIt();

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
                    // muda esquema de cores
                    // fazer função auxiliar que ao ser chamada incremente um ponteiro em um array de estilos
                    estado.modoAtivo = 'ver';
                    if (estado.estilo === 'padrao') {
                        estado.estilo = 'noturno';
                    } else {
                        estado.estilo = 'padrao';
                    }
            }
        }

        await setState(estado);

    });

    // captura clique na barra de abas
    let tabBar = document.getElementById('tab-bar');
    tabBar.addEventListener('click', async e => {

        let estado = getState();
        e.preventDefault();

        let insideTarget = e.composedPath()[0]; // esse é o target verdadeiro dentro da shadow root. Útil para indicar, por exemplo, um clique no "X" (deletar) em modo edição

        let abaClicada = estado.view.paginaAtiva; // a variável abaClicada começa com o valor da aba que já está ativa. Importante caso o target não seja uma aba ou caso a criação de nova aba falhe
        if (e.target.id === 'nova-pagina') { // no modo edição um clique na aba "+" cria nova página
            const dadosNovaPagina = {
                pessoa_id: estado.auth.id,
				titulo: 'nova-pagina',
				publica: true,
				html: ''
			}

            let res = await serverFetch(`/pessoas/${estado.auth.id}/paginas`, 'POST', dadosNovaPagina);
            
            if (res.status === 201) { // status 201 = página criada com sucesso
                let r = res.json();
                if (r) {
                    abaClicada = r.pagina_pessoal_id;
                }
                estado.view.paginaAtiva = abaClicada;
            } else {
                alert('Aconteceu um erro ao criar a página. Por favor, tente novamente');
            }

            /* if (dadosResposta) { // caso tenha tido sucesso ao criar nova página
                abaClicada = dadosResposta.pagina_pessoal_id;
            } */

        } else { 
            
            if (e.target.pageId) { // clique em uma aba de página já existente
                if (insideTarget.getAttribute('id') === 'delete') { // clique no botão "deletar página"
                    // aviso perguntando se a pessoa tem certeza
                    // caso confirme
                    //  -> caso sucesso
                    //      -> fazer fetch delete e renderizar novamente, mudando abaClicada para a primeira da lista
                    let res = await serverFetch(`/pessoas/${estado.auth.id}/${e.target.pageId}`, 'DELETE');
                    if (res.status === 204) { // status 204 = recurso não encontrado (deletou com sucesso)
                        // deleta página da lista de páginas no estado
                        let indicePagDeletada;
                        for (let i = 0; i < estado.view.paginas.length; i++) {
                            if (estado.view.paginas[i].id == e.target.pageId) {
                                indicePagDeletada = i;
                            }
                        }
                        if (indicePagDeletada) {
                            estado.view.paginas.splice(indicePagDeletada, 1);
                        }

                        // muda aba ativa ('clicada') para primeira página disponível, se a atual tiver sido deletada
                        if (indicePagDeletada === estado.view.paginaAtiva) {
                            abaClicada = estado.view.paginas[0].id;
                        }
                    } else {
                        alert('Aconteceu um erro ao deletar a página. Por favor, tente novamente');
                    }
                    //  -> caso fracasso
                    //      -> exibir aviso com mensagem de erro recebida
                    // caso cancele, prosseguir sem deletar
                
                } else if (insideTarget.getAttribute('id') === 'editTitle') { // clique no botão "editar título da página"
                    console.log('editar título');

                    // revisar a lista abaixo.
                    // novo plano: editar o texto do elemento html aqui e mudar estado.view.paginas[n].titulo. Depois, em setState(), o PUT incluirá o título.

                    // criar elemento de edição de texto com conteúdo igual ao título atual
                    // sobrepor elemento ao botão que contém o título (append na página e position absolute no mesmo lugar onde está o título-botão "main"?)
                    // adicionar event listener (um para enter e um para clique em qualquer lugar da página?)
                    //  -> faz fetch put editando o título
                    //      -> caso sucesso
                    //          -> renderiza novamente, mudando abaClicada para a que foi editada
                    //      -> caso fracasso
                    //          -> exibe aviso com mensagem de erro recebida
                } else { // caso o clique tenha sido na aba em si
                    let paginasMatch = estado.view.paginas.find(pag => pag.id == e.target.pageId); // encontra aba clicada entre as páginas possíveis no estado atual
                    abaClicada = paginasMatch.id;
                }
            }
        }
        
        // atualiza estado
        estado.view.paginaAtiva = abaClicada;
        await setState(estado, 'noPush');

    }); 
});