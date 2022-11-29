const templateMalocaViewer = document.createElement('template');

templateMalocaViewer.innerHTML = `
<style>

* {
	color: var(--cor-fonte-view);
	box-sizing: border-box;
	font-family: var(--familia-fonte);
}

main {
    background-color: var(--cor-fundo);
	color: var(--cor-fonte-view);
	min-height: 60rem;
}

a {
    text-decoration: underline;
    cursor: pointer;
	color: var(--cor-fonte-view);
}

a:hover {
    text-decoration:overline;
}

button {
    border-top: none;
    border-left: none;
    border-bottom: 0.1rem solid var(--cor-gris-2);
    border-right: 0.1rem solid var(--cor-gris-2);
    padding: 0.5rem;
    border-radius: 0.2rem;
    cursor: pointer;
    transition: 0.05s;
	background-color: var(--cor-destaque);
	color: var(--cor-fonte-barra);
}

button:active {
    border-top: 0.1rem solid var(--cor-gris-2);
    border-left: 0.1rem solid var(--cor-gris-2);
    border-bottom: 0.1rem solid var(--cor-fundo-2);
    border-right: 0.1rem solid var(--cor-fundo-2);
	background-color: var(--cor-principal);
	color: var(--cor-fonte-barra);
}

</style>

<main>
</main>
`

class MalocaViewer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateMalocaViewer.content.cloneNode(true));
	}

	get html() {
		return this.shadowRoot.querySelector('main').innerHTML;
	}

	set html(html) {
		this.shadowRoot.querySelector('main').innerHTML = html;
	}

	get text() {
		return this.shadowRoot.querySelector('main').innerText;
	}

	set text(texto) {
		this.shadowRoot.querySelector('main').innerText = texto;
	}

	get editable() {
		return this.shadowRoot.querySelector('main').contentEditable;
	}

	set editable(valor) {
		this.shadowRoot.querySelector('main').contentEditable = valor;
	}

	focusOnIt() {
		this.shadowRoot.querySelector('main').focus();
	}
}

window.customElements.define('maloca-viewer', MalocaViewer);