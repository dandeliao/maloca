import Inicio from "./views/Inicio.js"
import Painel from "./views/Painel.js"
import Pessoa from "./views/Pessoa.js"
import Comunidade from "./views/Comunidade.js"
import Error404 from "./views/Error404.js";

const urlServidor = "http://localhost:4000";

function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
}

function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

function navigateTo(url) {
    history.pushState(null, url, url);
    router();  
}

async function router() {
    
    const routes = [
        { path: "/", view: Inicio},
        { path: "/painel", view: Painel},
        { path: "/pessoa/:nome", view: Pessoa},
        { path: "/:nome", view: Comunidade}
    ];

    // Testa se as rotas correspondem ao caminho atual
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potMatch => potMatch.result !== null);

    if (!match) {
        match = {
            route: { path: "/404", view: Error404},
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    document.querySelector("#view").innerHTML = await view.getHtml();
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    
    // captura o clique em links para router
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            if (e.target.href) {
                navigateTo(e.target.href);
            } else {
                // para o caso de components m-link
                navigateTo(e.target.attributes.href.value);
            }
        }
    });
    router();


    // modais
    // ---

    let modal = document.getElementById("modal");
    let modalClose = document.getElementsByClassName("close")[0];
    let modalBody = document.getElementsByClassName("modal-body")[0];

    function closeModal() {
        while(modalBody.firstChild) {
            modalBody.removeChild(modalBody.firstChild);
        }
        modal.style.display = "none";
    };

    modalClose.addEventListener("click", () => {
        closeModal();
    });

    window.addEventListener("click", e => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // modal editar
    let btnEditar = document.getElementById("btn-editar");
    btnEditar.addEventListener("click", e => {
        let form = document.createElement("form");
        /* form.innerHTML = `
            <label for="html" hidden>HTML:</label>
            <textarea name="html" id="html-field" autofocus style="display: block; margin: 0 auto; width: 100%; height: 100%;"></textarea>
            <input type="submit" value="salvar" style="display: block; margin: 1rem auto">
        `; */
        form.innerHTML = `
            <label for="html" hidden>HTML:</label>
            <div name="html" id="html-field" autofocus style="display: block; position: relative; margin: 0 auto; width: 100%; height: 100%;"></div>
            <input type="submit" value="salvar" style="display: block; margin: 1rem auto">
        `;
        form.style.height = "100%";
        form.style.display = "flex";
        form.style.flexDirection = "column";
        modalBody.appendChild(form);

        //let htmlField = document.getElementById("html-field");
        let htmlField = ace.edit("html-field");
        let currentView = document.getElementById("view");
        htmlField.session.setMode("ace/mode/html")
        htmlField.setTheme("ace/theme/ambiance");
        htmlField.setPrintMarginColumn(160);
        htmlField.session.setValue(currentView.innerHTML);

        form.addEventListener("submit", e => {
            // atualiza página no servidor
            /* lógica:
                1 - verifica location.pathname:
                    -- se /pessoa/:nome -> atualizará /pessoas/:nome
                    -- se /:nome -> atualizará /comunidades/:nome
                    -- se / -> atualizará /instancias/maloca
                2 - faz fetch do recurso JSON completo
                3 - modifica propriedade .html do recurso
                4 - faz fetch PUT do recurso
            */

            let pessoaRegex = /^\/pessoa\/(\w{2,}(-?\w+)+)$/i;
            let comunaRegex = /^\/(\w{2,}(-?\w+)+)$/i;

            let pessoinha = pessoaRegex.exec(location.pathname);
            let comuninha = comunaRegex.exec(location.pathname);

            if (pessoinha) {
                fetch(`${urlServidor}/api/pessoas/${pessoinha[1]}`)
                .then(res => {
                    return res.json();
                }).then(pessoaInteira => {

                    pessoaInteira.html = htmlField.getValue();

                    fetch(`${urlServidor}/api/pessoas/${pessoinha[1]}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(pessoaInteira)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/pessoas/${pessoinha[1]}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            currentView.innerHTML = paginaAtualizada.html;
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (comuninha) {
                fetch(`${urlServidor}/api/comunidades/${comuninha[1]}`)
                .then(res => {
                    return res.json();
                }).then(comunaInteira => {

                    comunaInteira.html = htmlField.getValue();

                    fetch(`${urlServidor}/api/comunidades/${comuninha[1]}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(comunaInteira)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/comunidades/${comuninha[1]}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            currentView.innerHTML = paginaAtualizada.html;
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (location.pathname === "/") {
                fetch(`${urlServidor}/api/instancias/maloca`)
                .then(res => {
                    return res.json();
                }).then(malocaInteira => {

                    malocaInteira.html = htmlField.getValue();

                    fetch(`${urlServidor}/api/instancias/maloca`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(malocaInteira)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/instancias/maloca`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            currentView.innerHTML = paginaAtualizada.html;
                        })
                    }).catch(erro => console.log(erro));
                });
            } else {
                console.log(e+":", "endereço inválido");
            }
            
            e.preventDefault();

            htmlField.destroy();
            htmlField.container.remove();
            closeModal();
        });

        modal.style.display = "block";
    });

});