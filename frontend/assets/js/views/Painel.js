import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Maloca - Painel");
        this.toggleAppBarButtons(false, true, false);
    }

    async getHtml() {
        return `
        <m-container style="--background-image: linear-gradient(lightpink, #a7f3d0);">
            <m-card>
                <div class="info-perfil">
                    <img src="http://localhost:4000/pessoas/dani/avatar.png">
                    <div>
                        <h2><a href="/pessoa/dani" data-link>Dani</a></h2>
                        <p>Na Maloca há 6 meses</p>
                        <p>Participa de 22 comunidades</p>
                    </div>
                </div>
            </m-card>
            <m-card>
                <h3>Minhas Comunidades:</h3>
                <m-card>
                    <a href="/radio-maloca" data-link>radio maloca</a>
                </m-card>
                <p>...</p>
            </m-card>
        </m-container>
        <style>
            .info-perfil {
                display: flex;
                flex-direction: row;
                justify-content: start;
            }
            .info-perfil > img {
                max-width: 80px;
                max-height: 80px;
                width: 100%;
                height: auto;
                border-radius: 100%;
                margin-right: 2rem;
            }
            .clicavel:hover {
                cursor: pointer;
            }
            ul {
                margin-left: 2rem;
            }
        </style>
        `;
    }
}