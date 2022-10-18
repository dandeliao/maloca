const templateMalocaViewer = document.createElement('template');

templateMalocaViewer.innerHTML = `
<style>

* {
	color: #1B1B1B;
	box-sizing: border-box;
}

a {
    text-decoration: underline;
    cursor: pointer;
}

a:hover {
    text-decoration:overline;
}

btn {
    border-top: 0.12rem solid #a3a3a3;
    border-left: 0.12rem solid #a3a3a3;
    border-bottom: 0.12rem solid #1B1B1B;
    border-right: 0.12rem solid #1B1B1B;
    padding: 0.5rem;
    border-radius: 5%;
    cursor: pointer;
    transition: 0.05s;
}

btn:active {
    border-top: 0.12rem solid #1B1B1B;
    border-left: 0.12rem solid #1B1B1B;
    border-bottom: 0.12rem solid #a3a3a3;
    border-right: 0.12rem solid #a3a3a3;
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