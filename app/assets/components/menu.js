const templateMalocaMenu = document.createElement('template');

templateMalocaMenu.innerHTML = `
<style>

* {
	color: #1B1B1B;
	background-color: #EFEFEF;
	box-sizing: border-box;
}

a {
    text-decoration: none;
	font-size: 1.6rem;
    cursor: pointer;
}

a:hover {
	background-color: #886098;
	color: #EFEFEF;
}

main {
	width: 100%;
	overflow: hidden;
	padding: 1rem;
	border: 2px solid black;
	border-left: none;
}

img {
	border-radius: 100%;
	height: 2rem;
	width: 2rem;
}

img.cover { object-fit: cover; } /* amplia imagem se necessário, para manter proporções */

ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

div {
	margin-bottom: 0.75rem;
}

</style>

<main>
<div>
	<img />
	<span></span>
</div>
<ul></ul>
</main>
`

class MalocaMenu extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateMalocaMenu.content.cloneNode(true));
	}

	addItem (texto, caminho) {
		try {
			let lista = this.shadowRoot.querySelector('ul');
			let novoItem = document.createElement('li');
			novoItem.innerHTML = `<a href="${caminho}" data-link>${texto}</a>`;
			lista.appendChild(novoItem);
		} catch (erro) {
			console.log('erro ao adicionar item ao menu:', erro);
		}
	}

	addProfile (imgSource, name) {
		try {
			let img = this.shadowRoot.querySelector('img');
			let nome = this.shadowRoot.querySelector('span');
			img.setAttribute('src', imgSource);
			nome.innerText = name;
		} catch (erro) {
			console.log('erro ao adicionar perfil ao menu:', erro);
		}
	}
}

window.customElements.define('maloca-menu', MalocaMenu);