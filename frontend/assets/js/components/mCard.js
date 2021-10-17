import MalocaElement from "./MalocaElement.js";

class MCard extends MalocaElement {
    constructor() {
        let html = `
        <div class="card">

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
                h1 {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .card {
                    margin: 20px auto;
                    background: var(--background-card, #FFFFFF);
                    width: 100%;
                    border-radius: 0.5rem;
                    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
                    padding: 0.5rem;
                }
            </style>
        </div>
        `
        super(html);
    }
}

window.customElements.define('m-card', MCard);