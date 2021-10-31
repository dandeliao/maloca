export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }

    toggleAppBarButtons(editar, clonar, info) {
        let btnEditar = document.getElementById("btn-editar");
        let btnClonar = document.getElementById("btn-clonar");
        let btnInfo = document.getElementById("btn-info");
    
        if (editar) {
            btnEditar.disabled = false;
            btnEditar.classList.remove("disabled");
        } else {
            btnEditar.disabled = true;
            btnEditar.classList.add("disabled");
        }

        if (clonar) {
            btnClonar.disabled = false;
            btnClonar.classList.remove("disabled");
        } else {
            btnClonar.disabled = true;
            btnClonar.classList.add("disabled");
        }

        if (info) {
            btnInfo.disabled = false;
            btnInfo.classList.remove("disabled");
        } else {
            btnInfo.disabled = true;
            btnInfo.classList.add("disabled");
        }
    }
    
}