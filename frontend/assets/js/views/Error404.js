import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("erro 404");
        this.toggleAppBarButtons(false, false, false);

    }

    async getHtml() {
        return `
            <h1>Erro 404</h1>
            <p>
                Não foi possível carregar :(
            </p>
        `;
    }
}