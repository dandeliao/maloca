import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("maloca");
        this.toggleAppBarButtons(true, true, true);
    }

    async getHtml() {
        const instancia = await fetch(`http://localhost:4000/api/instancias/maloca`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if(res.status == 404) {
                return Promise.reject(new Error('Erro 404: não encontrado'));
            } else {
                return Promise.reject(new Error('Erro: ' + res.status));
            }
        });
        
        return instancia.html;
    }
}