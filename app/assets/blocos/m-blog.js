import MalocaElement from "./MalocaElement.js";
import { serverFetch } from "../utils/fetching.js";

class MBlog extends MalocaElement {
    constructor() {

        let html = `
        <div class="blog">

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
        let nomeBlog = this.getAttribute('nome');

		let res = await serverFetch(`/${tipo}s/${id}/objetos/textos?blog=${nomeBlog}`, 'GET');
		let textos = await res.json();

		console.log('!!!!!!!!!! textos:', textos);

		if (textos.length > 0) {

			let elTituloDoBlog = document.createElement('h2');
			elTituloDoBlog.textContent = nomeBlog;
			this.appendChild(elTituloDoBlog);
			
			textos.forEach(async txt => {
				
				console.log('texto:', txt);
				let elBloco = document.createElement('m-bloco');

				// cria elemento com o texto da postagem
				let elTexto = document.createElement('m-texto');
				let textoId;
				if (tipo === 'pessoa') {
					textoId = txt.texto_pessoal_id;
				} else if (tipo === 'comunidade') {
					textoId = txt.texto_comunitario_id;
				}
				elTexto.setAttribute('numero', textoId);
				elTexto.setAttribute(`${tipo}`, id); // pessoa=id-da-pessoa ou comunidade=id-da-comunidade

				// cria elemento que receberá informações (pessoa que postou, data de postagem, comentários)
				let elInfo = document.createElement('div');
				
				// cria elementos com informações da pessoa que postou
				let elPessoa = document.createElement('div');
				let elAvatar = document.createElement('m-avatar');
				let elDivNomeArroba = document.createElement('div');
				let elNome = document.createElement('div');
				let elArroba = document.createElement('a');
				let res = await serverFetch(`/pessoas/${txt.pessoa_id}`, 'GET');
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
				let elBotaoComentarios = document.createElement('button');
				elBotaoComentarios.innerText = 'ver comentários';
				// regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
				let dataRegex = txt.data_criacao.matchAll(/(\d*)(?:-|T)/g);
				let dataMatch = [];
				for (const d of dataRegex) {
					dataMatch.push(d);
				}
				elData.innerText = 'postado em ' + dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];
				elDadosPostagem.appendChild(elData);
				elDadosPostagem.appendChild(elBotaoComentarios);

				elInfo.appendChild(elPessoa);
				elInfo.appendChild(elDadosPostagem);

				// estiliza elementos
				elInfo.style.display = 'flex';
				elInfo.style.justifyContent = 'space-between';
				elInfo.style.alignItems = 'flex-end';
				elPessoa.style.display = 'flex';
				elPessoa.style.alignItems = 'center';
				elPessoa.style.gap = '1rem';
				elAvatar.redondo = false;
				elAvatar.style.maxWidth = '64px';
				elDivNomeArroba.style.textAlign = 'left';
				elDadosPostagem.style.display = 'flex';
				elDadosPostagem.style.flexDirection = 'column';
				elDadosPostagem.style.justifyContent = 'space-between';
				elDadosPostagem.style.gap = '1rem';
				elInfo.style.borderTop = '1px dashed var(--cor-destaque)';
				elInfo.style.margin = '0 0.5rem';
				elInfo.style.paddingTop = '0.75rem';
				elTexto.style.marginBottom = '1.5rem';
				elTexto.style.width = '100%';
				elTexto.style.padding = '0 0.5rem';

				elBloco.appendChild(elTexto);
				elBloco.appendChild(elInfo);
				this.appendChild(elBloco);
				this.appendChild(document.createElement('br'));

				// renderiza blocos
				elAvatar.renderizar(estado);
				elTexto.renderizar(estado);

				// adiciona informações como atributos no botão, para facilitar o uso no eventListener
				elBotaoComentarios.setAttribute('textoId', textoId);
				elBotaoComentarios.setAttribute(`${tipo}`, id); // pessoa=id-da-pessoa ou comunidade=id-da-comunidade
				
				// quando clicado, exibe comentários
				elBotaoComentarios.addEventListener('click', async e => {
					
					// alterna entre botão pressionado/solto
					e.target.classList.toggle('pressionado');

					// encontra o bloco m-texto parente do botão
					const textos = this.querySelectorAll('m-texto');
					const blocoTexto = Array.from(textos).find(t => t.getAttribute('numero') == textoId);

					if (e.target.classList.contains('pressionado')) {

						// estiliza botão pressionado
						e.target.innerText = 'ocultar comentários';
						e.target.style.backgroundColor = 'var(--cor-destaque)';
						e.target.style.color = 'var(--cor-fundo)';
						e.target.style.borderTop = '0.1rem solid #1B1B1B';
						e.target.style.borderLeft = '0.1rem solid #1B1B1B';
						e.target.style.borderBottom = '0.1rem solid #a3a3a3';
						e.target.style.borderRight = '0.1rem solid #a3a3a3';

						// pede comentários para o servidor
						const comunidadeId = e.target.getAttribute('comunidade');
						const textoId = e.target.getAttribute('textoId');
						const res = await serverFetch(`/comunidades/${comunidadeId}/objetos/texto?id=${textoId}&comentarios=true`, 'GET');
						const comentarios = await res.json();

						// cria elementos com os comentários e suas informações
						for (let i = 0; i < comentarios.length; i++) {

							let comentario = comentarios[i];
							console.log('texto:', comentario);

							// cria div para agrupar o texto do comentário e as informações de postagem
							let elContainer = document.createElement('div');
							elContainer.classList.add('comentario');

							// cria elemento com o texto do comentário
							let elTexto = document.createElement('div');
							elTexto.innerText = comentario.texto;

							// cria elemento que receberá informações (pessoa que postou e data de postagem)
							let elInfo = document.createElement('div');
							
							// cria elementos com informações da pessoa que postou
							let elPessoa = document.createElement('div');
							let elAvatar = document.createElement('m-avatar');
							let elDivNomeArroba = document.createElement('div');
							let elNome = document.createElement('div');
							let elArroba = document.createElement('a');
							let res = await serverFetch(`/pessoas/${comentario.pessoa_id}`, 'GET');
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

							// cria elemento com data do comentário
							let elData = document.createElement('div');
							let dataRegex = comentario.data_criacao.matchAll(/(\d*)(?:-|T)/g); // regex para converter formato de data (timestampz do psql) em DD/MM/AAAA
							let dataMatch = [];
							for (const d of dataRegex) {
								dataMatch.push(d);
							}
							elData.innerText = 'postado em ' + dataMatch[2][1] + '/' + dataMatch[1][1] + '/' + dataMatch[0][1];

							elInfo.appendChild(elPessoa);
							elInfo.appendChild(elData);

							// estiliza elementos
							elInfo.style.display = 'flex';
							elInfo.style.justifyContent = 'space-between';
							elInfo.style.alignItems = 'flex-end';
							elInfo.style.marginTop = '1rem';
							elInfo.style.color = 'inherit';
							elPessoa.style.display = 'flex';
							elPessoa.style.alignItems = 'center';
							elPessoa.style.gap = '1rem';
							elPessoa.style.color = 'inherit';
							elAvatar.redondo = false;
							elAvatar.style.maxWidth = '48px';
							elDivNomeArroba.style.textAlign = 'left';
							elDivNomeArroba.style.color = 'inherit';
							elNome.style.color = 'inherit';
							elNome.style.fontSize = '0.75rem';
							elArroba.style.color = 'inherit';
							elArroba.style.fontSize = '0.75rem';
							elData.style.color = 'inherit';
							elData.style.fontSize = '0.75rem';
							elTexto.style.width = '100%';
							elTexto.style.textAlign = 'justify';
							elTexto.style.color = 'inherit';
							elContainer.style.marginTop = '1rem';
							elContainer.style.padding = '0.75rem 1rem';
							//elContainer.style.backgroundColor = 'var(--cor-principal)';
							//elContainer.style.color = 'var(--cor-fonte-barra)';
							elContainer.style.border = '1px solid var(--cor-destaque)';
							elContainer.style.borderRadius = '0.4rem';

							elContainer.appendChild(elTexto);
							elContainer.appendChild(elInfo);

							blocoTexto.parentElement.appendChild(elContainer);

							// renderiza blocos
							elAvatar.renderizar(estado);
						}

						// cria form para adicionar novo comentário
						let formAdicionar = document.createElement('form');
						formAdicionar.innerHTML = `
							<label for="comentario" hidden>novo comentário</label>
							<textarea id="novo-comentario" placeholder="novo comentário" name="comentario" required style="width: 100%; min-height: 3rem; background-color: var(--cor-fundo); color: var(--cor-fonte-view);"></textarea>
							<br>
							<br>
							<button type="submit">comentar</button>
							`;
						formAdicionar.style.margin = '1rem 0';
						formAdicionar.classList.add('comentario');
						blocoTexto.parentElement.appendChild(formAdicionar);

						formAdicionar.addEventListener('submit', async e => {
							e.preventDefault();
			
							const dados = {
								texto: 	formAdicionar.elements['comentario'].value
							}
			
							serverFetch(`/comunidades/${comunidadeId}/objetos/comentarios?texto=${textoId}`, 'POST', dados)
								.then(res => res.json())
								.then(data => {            
										console.log('data comentário novo:', data);
									this.renderizar(estado);
							  });
						});

					} else {

						// estiliza botão não-pressionado
						e.target.innerText = 'ver comentários';
						e.target.style.backgroundColor = 'var(--cor-principal)';
						e.target.style.color = 'var(--cor-fonte-barra)';
						e.target.style.borderTop = '0.1rem solid #a3a3a3';
						e.target.style.borderLeft = '0.1rem solid #a3a3a3';
						e.target.style.borderBottom = '0.1rem solid #1B1B1B';
						e.target.style.borderRight = '0.1rem solid #1B1B1B';
						
						blocoTexto.parentElement.querySelectorAll('.comentario').forEach(el => {
							el.parentNode.removeChild(el)
						})

					}
				});
			});
		} else {
			console.log('Não há textos para mostrar');
		}
    }
}

window.customElements.define('m-blog', MBlog);