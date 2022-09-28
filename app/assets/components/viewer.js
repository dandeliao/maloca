const templateMalocaViewer = document.createElement('template');

templateMalocaViewer.innerHTML = `
<main>
<slot></slot>
</main>
`

class MalocaViewer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.appendChild(templateMalocaViewer.content.cloneNode(true));

	}
}

window.customElements.define('maloca-viewer', MalocaViewer);