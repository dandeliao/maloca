import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`Maloca - ${this.params.nome}`);
        this.toggleAppBarButtons(true, true, true);

    }

    async getHtml() {
        const pessoa = await fetch(`http://localhost:4000/api/pessoas/${this.params.nome}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if(res.status == 404) {
                return Promise.reject(new Error('Erro 404: não encontrado'));
            } else {
                return Promise.reject(new Error('Erro: ' + res.status));
            }
        });
        
        return pessoa.html;
        
    }
}