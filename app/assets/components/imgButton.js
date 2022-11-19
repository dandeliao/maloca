const templateImgButton = document.createElement('template');

templateImgButton.innerHTML = `
<style>

button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    text-align: inherit;
    background: transparent;

    color: var(--cor-fonte-barra);
    font-family: var(--familia-fonte);

	display: inline-block;
	height: 100%;
	border-radius: 100%;
	padding: 0.12rem;
	cursor: pointer;
	transition: 0.07s;
}

img {
	height: 100%;
	width: auto;
}

button:active {
	background-color: var(--cor-destaque);
}

button.pressed {
	background-color: var(--cor-destaque);
}

button:disabled {
	cursor:default;
	background-color: transparent;
	color: var(--cor-gris);
	/* filter: brightness(.9) invert(.5) sepia(.5) hue-rotate(100deg) saturate(0%); */
}

</style>

<button>
	<img>
</button>
`

class ImgButton extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.appendChild(templateImgButton.content.cloneNode(true));

		let img = this.shadowRoot.querySelector('img');
		img.src = this.getAttribute('imagem');
		img.alt = this.getAttribute('descricao');
		img.title = this.getAttribute('descricao');

	}

	get enabled() {
		let btn = this.shadowRoot.querySelector('button');
		if (btn.disabled) {
			return false;
		} else {
			return true;
		}
	}

	get pressed() {
		let classPressed = this.shadowRoot.querySelector('.pressed');
		if (classPressed) {
			return true;
		} else {
			return false
		}
	}

	set enabled(habilitado) {
		let btn = this.shadowRoot.querySelector('button');
		btn.disabled = !habilitado;
	}

	set pressed(pressiona) {
		let btn = this.shadowRoot.querySelector('button');
		if (pressiona) {
			btn.classList.add('pressed');
		} else {
			btn.classList.remove('pressed');
		}
	}

}

window.customElements.define('img-button', ImgButton);