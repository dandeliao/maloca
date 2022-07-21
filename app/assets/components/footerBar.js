const templateFooterBar = document.createElement('template');
// copiar css e html dos arquivos correspondentes em /assets/components/html e /assets/components/css
templateFooterBar.innerHTML = `
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

footer {
    background-color: #a7f3d0;
    color: #1B1B1B;
    height: 2rem;
    display: grid;
    grid-template-columns: 7fr 1fr 7fr;
    align-items: center;
}

footer .esquerda {
    text-align: right;
}

footer span {
    text-align: center;
}

</style>

<footer>
        <div class="esquerda">
            <a href="https://github.com/dandeliao/maloca">contribua</a>
        </div>
        <span>·</span>
        <div class="direita">
            <a href="https://www.youtube.com/watch?v=OrQIMUe2uBQ">quem somos nós</a>
        </div>
</footer>
`;

class footerBar extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(templateFooterBar.content.cloneNode(true));

	}
}

window.customElements.define('footer-bar', footerBar);