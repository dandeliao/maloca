import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`Maloca - ${this.params.nome}`);
    }

    async getHtml() {
        console.log(this.params.nome);
        return `
            <m-container>
            <h1>Pessoa</h1>
                <m-card>
                    <h1>fulane de tal</h1>
                </m-card>
            </m-container>
        `;
    }
}