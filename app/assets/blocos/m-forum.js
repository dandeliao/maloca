import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MForum extends MalocaElement {
    constructor() {

        let html = `
        <div class="forum">

            <slot></slot>

        </div>
        `
        super(html);

    }

    async renderizar(estado) {

        while (this.lastChild) {
			this.removeChild(this.lastChild);
		}

        let tipo = estado.view.tipo;
        let id = estado.view.id;
        let nomeForum = this.getAttribute('nome');

		// cria cabeçalho
		let blocoCabecalho = document.createElement('m-bloco');
		let elNomeForum = document.createElement('h2');
		elNomeForum.innerText = nomeForum;
		blocoCabecalho.appendChild(elNomeForum);
		this.appendChild(blocoCabecalho);
		this.appendChild(document.createElement('br'));

		let res = await serverFetch(`/${tipo}s/${id}/objetos/topicos?forum=${nomeForum}`, 'GET');
		let topicos = await res.json();


		if (topicos.length > 0) {
			
			topicos.forEach(async topico => {
				
				let elBloco = document.createElement('m-bloco');

				// cria elemento com o tópico
				let elTopico = document.createElement('m-topico');
				let topicoId;
				topicoId = topico.topico_id;
				elTopico.setAttribute('numero', topicoId);
				elTopico.setAttribute(`${tipo}`, id); // comunidade=id-da-comunidade

				// cria elemento que receberá informações (pessoa que postou, data de postagem, comentários)
				let elInfo = document.createElement('div');
				
				// cria elementos com informações da pessoa que postou
				let elPessoa = document.createElement('div');
				let elAvatar = document.createElement('m-avatar');
				let elDivNomeArroba = document.createElement('div');
				let elNome = document.createElement('div');
				let elArroba = document.createElement('a');
				let res = await serverFetch(`/pessoas/${topico.pessoa_id}`, 'GET');
				let pessoa = await res.json();
				elAvatar.setAttribute('pessoa', pessoa.nome);
				elNome.innerText = pessoa.nome;
				elArroba.innerText = '@' + pessoa.pessoa_id;
				elArroba.setAttribute('href', `/pessoa/${pessoa.pessoa_id}`);
				elArroba.setAttribute('data-link', '');
				elDivNomeArroba.appendChild(elNome);
				elDivNomeArroba.appendChild(elArroba);
				elPessoa.appendChild(elAvatar);
				elPessoa.appendChild(elDivNomeArroba);

				// cria elementos com data da postagem e botão para ver os comentários
				let elDadosPostagem = document.createElement('div');
				let elData = document.createElement('div');
				// regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
				let dataRegex = topico.data_criacao.matchAll(/(\d*)(?:-|T)/g);
				let dataMatch = [];
				for (const d of dataRegex) {
					dataMatch.push(d);
				}
				elData.innerText = 'postado em ' + dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];
				elDadosPostagem.appendChild(elData);
				let elBotaoComentarios;
				elBotaoComentarios = document.createElement('button');
				elBotaoComentarios.innerText = 'ver comentários';
				elDadosPostagem.appendChild(elBotaoComentarios);

				elInfo.appendChild(elPessoa);
				elInfo.appendChild(elDadosPostagem);

				// estiliza elementos
				elInfo.style.display = 'flex';
				elInfo.style.justifyContent = 'space-between';
				elInfo.style.alignItems = 'flex-end';
				elInfo.style.gap = '2rem';
				elInfo.style.borderTop = '1px dashed var(--cor-destaque)';
				elInfo.style.paddingTop = '0.75rem';
				elTopico.style.width = '100%';
				elPessoa.style.display = 'flex';
				elPessoa.style.alignItems = 'flex-end';
				elPessoa.style.gap = '0.6rem';
				elAvatar.redondo = false;
				elAvatar.style.width = '64px';
				elAvatar.style.height = '64px';
				elDivNomeArroba.style.textAlign = 'left';
				elDadosPostagem.style.display = 'flex';
				elDadosPostagem.style.flexDirection = 'column';
				elDadosPostagem.style.justifyContent = 'flex-end';
				elDadosPostagem.style.gap = '1rem';

				elBloco.appendChild(elTopico);
				elBloco.appendChild(elInfo);
				this.appendChild(elBloco);
				this.appendChild(document.createElement('br'));

				// renderiza blocos
				elAvatar.renderizar(estado);
				elTopico.renderizar(estado);

				// adiciona informações como atributos no botão
				elBotaoComentarios.setAttribute('topicoId', topicoId);
				elBotaoComentarios.setAttribute(`${tipo}`, id); // comunidade=id-da-comunidade
				
				// quando clicado, exibe comentários
				elBotaoComentarios.addEventListener('click', async e => {
					
					// alterna entre botão pressionado/solto
					e.target.classList.toggle('pressionado');

					// encontra o bloco m-topico parente do botão
					const topicos = this.querySelectorAll('m-topico');
					const blocoTopico = Array.from(topicos).find(t => t.getAttribute('numero') == topicoId);

					if (e.target.classList.contains('pressionado')) {

						// estiliza botão pressionado
						e.target.innerText = 'ocultar comentários';
						e.target.style.backgroundColor = 'var(--cor-principal)';
						e.target.style.color = 'var(--cor-fonte-barra)';
						e.target.style.borderTop = '0.1rem solid #1B1B1B';
						e.target.style.borderLeft = '0.1rem solid #1B1B1B';
						e.target.style.borderBottom = '1px solid var(--cor-fundo-2)';
						e.target.style.borderRight = '1px solid var(--cor-fundo-2)';

						// cria bloco que exibe comentários
						let elComentarios = document.createElement('m-comentarios');
						elComentarios.setAttribute('topico', topicoId);
						elComentarios.setAttribute('comunidade', id);
						elComentarios.classList.add('secao-comentarios');
						blocoTopico.parentElement.appendChild(elComentarios);
						elComentarios.renderizar(estado);

						// cria bloco com formulário para adicionar novo comentário
						let elAdicionar = document.createElement('m-adicionar-comentario');
						elAdicionar.setAttribute('topico', topicoId);
						elAdicionar.setAttribute('comunidade', id);
						elAdicionar.classList.add('secao-comentarios');
						blocoTopico.parentElement.appendChild(elAdicionar);
						elAdicionar.renderizar(estado);


					} else {

						// estiliza botão não-pressionado
						e.target.innerText = 'ver comentários';
						e.target.style.backgroundColor = 'var(--cor-destaque)';
						e.target.style.color = 'var(--cor-fonte-view)';
						e.target.style.borderTop = '0.1rem solid var(--cor-fundo-2)';
						e.target.style.borderLeft = '0.1rem solid var(--cor-fundo-2)';
						e.target.style.borderBottom = '1px solid #1B1B1B';
						e.target.style.borderRight = '1px solid #1B1B1B';
						
						blocoTopico.parentElement.querySelectorAll('.secao-comentarios').forEach(el => {
							el.parentNode.removeChild(el)
						})

					}
				});
			});
		} else {
			console.log('Não há topicos para mostrar');

			let elBloco = document.createElement('m-bloco');
			let aviso = document.createElement('p');
			aviso.innerText = 'Não há topicos para mostrar';
			elBloco.appendChild(aviso);
			this.appendChild(elBloco);
			this.appendChild(document.createElement('br'));
		}
    }
}

window.customElements.define('m-forum', MForum);