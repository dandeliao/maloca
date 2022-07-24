const templateImgButton = document.createElement('template');
// copiar css e html dos arquivos correspondentes em /assets/components/html e /assets/components/css
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

    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;

	display: inline-block;
	height: 100%;
	cursor: pointer;
	transition: 0.07s;
}

img {
	height: 100%;
	width: auto;
}

button:hover {
	filter: brightness(.9) invert(.12) sepia(.9) hue-rotate(240deg) saturate(800%);
}

button:active {
	filter: brightness(.9) invert(.32) sepia(.9) hue-rotate(235deg) saturate(220%);
}

button.pressed {
	filter: brightness(.9) invert(.32) sepia(.9) hue-rotate(235deg) saturate(220%);
}

button:disabled {
	cursor:default;
	filter: brightness(.9) invert(.5) sepia(.5) hue-rotate(100deg) saturate(0%);
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

	get disabled() {
		let btn = this.shadowRoot.querySelector('button');
		if (btn.disabled) {
			return true;
		} else {
			return false
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

	set disabled(desabilita) {
		let btn = this.shadowRoot.querySelector('button');
		if (desabilita) {
			btn.setAttribute('disabled', true);
		} else {
			btn.setAttribute('disabled', false);
		}
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