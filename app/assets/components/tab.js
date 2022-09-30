const templateTab = document.createElement('template');

templateTab.innerHTML = `
<style>

#aba {
	box-sizing: border-box;
    margin: 0;
    width: auto;
    overflow: hidden;
    color: inherit;
    font: inherit;

	background-color: #C0C0C0;
	display: inline-block;
	height: 100%;
	min-width: 2em;
	max-width: 12em;
	padding: 0.2em 0.5em;
	white-space: nowrap;
	border-style: solid;
	border-bottom-style: none;
	border-left-style: none;
	border-width: 0.1em;
	border-color: #999999;
	border-top-left-radius: 0.4em;
	border-top-right-radius: 0.4em;
	transition: 0.07s;
}

#aba.selected {
	background-color: #F6F5F4;
	border-style: none;
}

button {
	color: inherit;
    font: inherit;
	border-style: none;
	background: transparent;
	cursor: pointer;
	text-align: center;
	height: 100%;
	max-width: 8em;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding: 0 0.1em;

}

button#delete {
	color: darkred;
	font-weight: bold;
	display: none;
}

button#editTitle {
	font-weight: bold;
	display: none;
}

button#delete.modoEditar,
button#editTitle.modoEditar {
	display: inline-block;
}

</style>

<div id="aba">
	<button id="delete">❌</button>
	<button id="editTitle">✏️</button>
	<button id="main"></button>
</div>
`

class Tab extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.appendChild(templateTab.content.cloneNode(true));

		let button = this.shadowRoot.querySelector('#main');
		button.innerText = this.getAttribute('texto');
		this.editarTitulo = false;

	}

	get texto() {
		let btn = this.shadowRoot.querySelector('#main');
		return btn.innerText;
	}

	set texto(t) {
		let btn = this.shadowRoot.querySelector('#main');
		btn.innerText = t;
	}

	get pageId() {
		return this.getAttribute('pageId');
	}

	set pageId(id) {
		this.setAttribute('pageId', id);
	}

	get modoEditar() {
		let classModoEditar = this.shadowRoot.querySelector('.modoEditar');
		if (classModoEditar) {
			return true;
		} else {
			return false;
		}
	}

	set modoEditar(editar) {
		let btnDelete = this.shadowRoot.querySelector('#delete');
		let btnEditTitle = this.shadowRoot.querySelector('#editTitle')
		if (editar) {
			btnDelete.classList.add('modoEditar');
			btnEditTitle.classList.add('modoEditar');
		} else {
			btnDelete.classList.remove('modoEditar');
			btnEditTitle.classList.remove('modoEditar');
		}
	}

	get selected() {
		let classSelected = this.shadowRoot.querySelector('.selected');
		if (classSelected) {
			return true;
		} else {
			return false
		}
	}

	set selected(pressiona) {
		let btn = this.shadowRoot.querySelector('#aba');
		if (pressiona) {
			btn.classList.add('selected');
		} else {
			btn.classList.remove('selected');
		}
	}

	get posicaoTitulo() {
		let btn = this.shadowRoot.querySelector('#main');
		return [btn.offsetLeft, btn.offsetTop + 32]; // 32 corresponde a 2rem (tamanho da navBar)
	}

	get tamanhoTitulo() {
		let btn = this.shadowRoot.querySelector('#main');
		return [btn.offsetWidth, btn.offsetHeight];
	}

}

window.customElements.define('maloca-tab', Tab);