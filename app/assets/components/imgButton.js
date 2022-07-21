const templateImgButton = document.createElement('template');
// copiar css e html dos arquivos correspondentes em /assets/components/html e /assets/components/css
templateImgButton.innerHTML = `
<style>

*, *:before, *:after {
    box-sizing: border-box;
    font-family: sans-serif;
}

html {
    font-size: 16px;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul, a {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: normal;
    font-size: 100%;
    text-decoration: none;
    color: inherit;
    font: inherit;
    vertical-align: baseline;
    cursor: default;
}

img {
    max-width: 100%;
    height: auto;
}

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
}

html {
    color: #1B1B1B;
    font-family: 'Courier New', Courier, monospace;
}

h1              { font-size: 2.3em;   margin: .28em 0 }
h2              { font-size: 1.6em; margin: .33em 0 }
h3              { font-size: 1.2em; margin: .4em 0 }
h4              { font-size: 1em;   margin: .5em 0 }
h5              { font-size: .85em; margin: .62em 0 }
h6              { font-size: .75em; margin: .8em 0 }
h1, h2, h3, h4,
h5, h6          { font-weight: bolder }

a {
    text-decoration:underline;
    cursor: pointer;
}

a:hover {
    text-decoration:overline;
}

button {
	display: inline-block;
	height: 100%;
	width: auto;
	border-style: none;
	border-width: 0.05em;
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

button.disabled {
	filter: brightness(.9) invert(.5) sepia(.5) hue-rotate(100deg) saturate(0%);
}

button.disabled:hover {
    cursor:default;
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
		let classDisabled = this.shadowRoot.querySelector(['disabled']);
		if (classDisabled.length > 0) {
			return true;
		} else {
			return false
		}
	}

	get pressed() {
		let classPressed = this.shadowRoot.querySelector(['pressed']);
		if (classPressed.length > 0) {
			return true;
		} else {
			return false
		}
	}

	set disabled(desabilita) {
		let btn = this.shadowRoot.querySelector('button');
		if (desabilita) {
			btn.classList.add('disabled');
			btn.setAttribute('disabled', true);
		} else {
			btn.classList.remove('disabled');
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