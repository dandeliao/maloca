import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Maloca - Painel");
        this.toggleAppBarButtons(false, false, false);
    }

    async getHtml() {
        // futuramente permitir que as pessoas editem seus paineis personalizados
        const painel = await fetch(`http://localhost:4000/api/instancias/maloca/painel`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if(res.status == 404) {
                return Promise.reject(new Error('Erro 404: não encontrado'));
            } else {
                return Promise.reject(new Error('Erro: ' + res.status));
            }
        });
        return painel.html;
    }
}