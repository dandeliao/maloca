import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Maloca - Painel");
        this.toggleAppBarButtons(false, false, false);
    }

    async getHtml() {
        return `
        <m-container style="
            --background-image: linear-gradient(lightpink, #a7f3d0);
            --container-background: rgba(256, 256, 256, 0.3);
            ">
            <m-card>
                <h3>Meus Perfis:</h3>
                <br>
                <div class="info-perfil">
                    <img src="http://localhost:4000/pessoas/dani/avatar.png">
                    <div>
                        <h4><a href="/pessoa/dani" data-link>Dani</a></h4>
                        <p>Na Maloca há 6 meses</p>
                        <p>Participa de 22 comunidades</p>
                    </div>
                </div>
                <div class="info-perfil">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/Daniel_O%27Rourke%27s_wonderful_voyage_to_the_moon_%281840-1850%29_-_Title_Page.png">
                    <div>
                        <h4><a href="/pessoa/dani" data-link>Rukib</a></h4>
                        <p>Na Maloca há 2 meses</p>
                        <p>Participa de 5 comunidades</p>
                    </div>
                </div>
            </m-card>
            <m-card>
                <h3>Minhas Comunidades:</h3>
                <br>
                <div class="info-comunidade">
                    <img src="http://localhost:4000/comunidades/radio-maloca/avatar.png">
                    <a href="/radio-maloca" data-link>Rádio Maloca</a>
                    <div style="margin-left: 1em">
                        <p> | dani (admin, moderação) </p>
                        <p> | rukib (edição) </p>
                    </div>
                </div>
                <p>...</p>
            </m-card>
        </m-container>
        <style>
            .info-perfil {
                display: flex;
                flex-direction: row;
                justify-content: start;
                margin-bottom: 1em;
            }
            .info-perfil > img {
                max-width: 80px;
                max-height: 80px;
                width: 100%;
                height: auto;
                border-radius: 100%;
                margin-right: 2em;
            }

            .info-comunidade {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
            }

            .info-comunidade > img {
                max-width: 80px;
                max-height: 80px;
                width: 100%;
                height: auto;
                margin-right: 2rem;
            }

            ul {
                margin-left: 2rem;
            }
        </style>
        `;
    }
}