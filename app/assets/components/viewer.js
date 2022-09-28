const templateMalocaViewer = document.createElement('template');

templateMalocaViewer.innerHTML = `
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
		console.log('shadowRoot main.innerHTML:', this.shadowRoot.querySelector('main').innerHTML);
		return this.shadowRoot.querySelector('main').innerHTML;
	}

	set html(html) {
		this.shadowRoot.querySelector('main').innerHTML = html;
		console.log(html);
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