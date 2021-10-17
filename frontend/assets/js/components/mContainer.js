import MalocaElement from "./MalocaElement.js";

class MContainer extends MalocaElement {
    constructor() {
        let html = `
        <div class="page">

            <div class="content"></div>

            <style>

                /* css reset */

                html {
                    box-sizing: border-box;
                    font-size: 16px;
                }
                *, *:before, *:after {
                    box-sizing: inherit;
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
                ol, ul {
                    list-style: none;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }

                /* style */

                .page {
                    background: var(--background, white);
                    background-image: var(--background-image, none);
                }

                .content {
                    display: block;
                    max-width: 960px;
                    margin: 0 auto;
                    padding: 1.2rem;
                    background: var(--background-container, white);
                }

                h1 {
                    font-size: 3rem;
                    font-weight: bold;
                }

            </style>
        </div>
        `
        super(html);
    }
}

window.customElements.define('m-container', MContainer);