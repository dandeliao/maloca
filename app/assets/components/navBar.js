const templateNavBar = document.createElement('template');
// copiar css e html dos arquivos correspondentes em /assets/components/html e /assets/components/css
templateNavBar.innerHTML = `
<style>
*, *:before, *:after {
    box-sizing: border-box;
    font-family: 'Convergence', sans-serif;
}

html {
    font-size: 16px;
    color: #1B1B1B;
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
    width: 100%;
    height: 0 auto;
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

h1              { font-size: 2.3em;   margin: .28em 0 }
h2              { font-size: 1.6em; margin: .33em 0 }
h3              { font-size: 1.2em; margin: .4em 0 }
h4              { font-size: 1em;   margin: .5em 0 }
h5              { font-size: .85em; margin: .62em 0 }
h6              { font-size: .75em; margin: .8em 0 }
h1, h2, h3, h4,
h5, h6          { font-weight: bolder }

a {
    text-decoration: none;
    cursor: pointer;
}

a:hover {
    font-weight: bold;
}

nav {
    background-color:lightpink;
    color: #1B1B1B;
	width: 100%;
	height: 2em;
	padding: 0.2em 0.4em;
    display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.actions {
    display: inline-block;
	height: 100%;
}

</style>

<nav>
	<div class="actions left">
		<img-button class= "press" imagem="/assets/images/menu.png" descricao="menu"></img-button>
		<img-button imagem="/assets/images/maloca.png" descricao="página inicial"></img-button>
	</div>
	<header><h3><slot /></h3></header>
	<div class="actions right">
		<img-button id="btn-editar" class="press disabled" imagem="/assets/images/editar.png" descricao="editar"></img-button>
		<img-button id="btn-clonar" class="press disabled" imagem="/assets/images/clonar.png" descricao="clonar"></img-button>
		<img-button id="btn-info" class="press" imagem="/assets/images/info.png" descricao="informação"></img-button>
	</div>
</nav>
`;

class navBar extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateNavBar.content.cloneNode(true));

	}
}

window.customElements.define('nav-bar', navBar);