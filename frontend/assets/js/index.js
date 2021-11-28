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

    async function fetchACoisaCerta(parametros) {
        // função auxiliar:
        // verifica se é pessoa, comunidade ou instância
        // faz o fetch de acordo com o objeto parametros (que contém method, headers, etc)
        // retorna um objeto

        let pessoaRegex = /^\/pessoa\/(\w{2,}(-?\w+)+)$/i;
        let comunaRegex = /^\/(\w{2,}(-?\w+)+)$/i;
        let pessoinha = pessoaRegex.exec(location.pathname);
        let comuninha = comunaRegex.exec(location.pathname);

        if (pessoinha) {
            return fetch(`${urlServidor}/api/pessoas/${pessoinha[1]}`, parametros)
                    .then(res => {
                        return res.json();
                    });
        } else if (comuninha) {
            return fetch(`${urlServidor}/api/comunidades/${comuninha[1]}`, parametros)
                    .then(res => {
                        return res.json();
                    });
        } else if (location.pathname === "/") {
            return fetch(`${urlServidor}/api/instancias/maloca`, parametros)
                    .then(res => {
                        return res.json();
                    });
        } else {
            console.log(e+":", "endereço inválido");
        }
    }

    // lógica para fechar o modal
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
        
        let cabecalho = document.createElement("header");
        cabecalho.classList.add("cabecalho-editar");
        cabecalho.innerHTML = `
            <h2><m-nome></m-nome></h2>
            <style>
                .cabecalho-editar {
                    text-align: center;
                }
            </style>
        `
        let form = document.createElement("form");
        form.innerHTML = `
            <div class="minicard perfil">
                <div class="secao-texto">
                    <div class="item-editar">
                        <label for="editar-descricao">Descrição:</label>
                        <input id="editar-descricao" maxlength="100"></input>
                    </div>
                    <div class="item-editar">
                        <label for="editar-cdl">Conjunto de linguagem:</label>
                        <input id="editar-cdl" maxlength="100"></input>
                    </div>
                </div>
                <div class="secao-microcards">
                    <div class="microcard">
                        <label for="editar-avatar">avatar:</label>
                        <img class="img-circular" id="editar-avatar"></img>
                        <input id="avatar-file" type="file" accept="image/*" />
                    </div>
                    <div class="microcard fundo">
                        <label for="editar-fundo">fundo:</label>
                        <img class="img-retangular" id="editar-fundo"></img>
                        <input id="fundo-file" type="file" accept="image/*" />
                    </div>
                </div>
            </div>
            <label for="html" hidden>HTML:</label>
            <div name="html" id="html-field" autofocus></div>
            <input type="submit" value="salvar alterações" style="display: block; margin: 1rem auto">
            <style>
                #html-field {
                    display: block;
                    position: relative;
                    margin: 0 auto;
                    width: 100%;
                    height: 100%;
                }

                .minicard {
                    padding: 0.5em;
                    margin-bottom: 1em;
                    border-radius: 0.3em;
                    border: 1px solid black;
                    text-align: left;
                }

                .minicard .secao-texto {
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    gap: 0.5em;
                }

                .minicard .secao-microcards {
                    display: flex;
                    flex-direction: row;
                    justify-content: start;
                    margin-top: 1em;
                }

                .item-editar {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .item-editar > input {
                    width: 100%;
                    margin-left: 1em;
                    flex: 2 2 10em;
                }

                .microcard {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 1.2em;
                    gap: 0.5em;
                    height: 100%;
                    overflow: hidden;
                }

                .img-circular {
                    height: 4rem;
                    overflow: hidden;
                    width: 4em;
                    height: 4em;
                    border-radius: 100%;
                }

                .img-retangular {
                    height: 4rem;
                    width: 10rem;
                    overflow: hidden;
                }
            </style>
        `;

        form.style.height = "100%";
        form.style.display = "flex";
        form.style.flexDirection = "column";

        modalBody.appendChild(cabecalho);
        modalBody.appendChild(form);
        modal.style.display = "block";

        let htmlField = ace.edit("html-field");
        let currentView = document.getElementById("view");
        htmlField.session.setMode("ace/mode/html")
        htmlField.setTheme("ace/theme/ambiance");
        htmlField.setPrintMarginColumn(160);
        htmlField.session.setValue(currentView.innerHTML);
        
        let inputDescricao = document.getElementById("editar-descricao");
        let inputCdl = document.getElementById("editar-cdl");
        let arquivoAvatar = document.getElementById("avatar-file");
        let arquivoFundo = document.getElementById("fundo-file");
        let imgAvatar = document.getElementById("editar-avatar");
        let imgFundo = document.getElementById("editar-fundo");
        
        fetchACoisaCerta({method:"GET"})
            .then(info => {
                // alimenta campos do formulário
                inputDescricao.value = info.descricao;
                inputCdl.value = JSON.stringify(info.conjuntoDeLinguagem);
                imgAvatar.src = `${urlServidor}${info.avatar}`;
                imgFundo.src = `${urlServidor}${info.fundo}`;

                // altera imagens do formulario quando novo arquivo é selecionado
                arquivoAvatar.addEventListener("change", e => {
                    imgAvatar.src = URL.createObjectURL(e.target.files[0]);
                });
                arquivoFundo.addEventListener("change", e => {
                    imgFundo.src = URL.createObjectURL(e.target.files[0]);
                });

                form.addEventListener("submit", e => {
                // ao clicar, envia dados para o servidor
            
                    fetchACoisaCerta({method: "GET"}).then(info => {
                        
                        let formulario = new FormData();
                        formulario.append("nome", info.nome);
                        formulario.append("tipo", info.tipo);
                        formulario.append("descricao", inputDescricao.value);
                        formulario.append("conjuntoDeLinguagem", inputCdl.value);
                        formulario.append("avatar", arquivoAvatar.files[0]);
                        formulario.append("fundo", arquivoFundo.files[0]);
                        formulario.append("html", htmlField.getValue());

                        fetch(`${urlServidor}/api/bota`, {method: "POST", body: formulario
                        }).then(res => res.json()
                        ).then(r => {
                            currentView.innerHTML = r.html;
                        }).catch(erro => console.log(erro));
        
                        // fecha o modal
                        htmlField.destroy();
                        htmlField.container.remove();
                        closeModal();
                    });
                    
                    e.preventDefault();
                });
        });
    });

    // modal clonar
    let btnClonar = document.getElementById("btn-clonar");
    btnClonar.addEventListener("click", e => {
        let form = document.createElement("form");
        form.innerHTML = `
            <fieldset>
                <legend>Clonar para onde?</legend>
                <input type="radio" id="comunaVelha" name="clonar_para" value="Comunidade existente">
                <label for="comunaVelha">Comunidade existente</label>
                <input type="radio" id="comunaNova" name="clonar_para" value="Comunidade nova" checked>
                <label for="comunaNova">Comunidade nova</label>
                <input type="radio" id="perfilVelho" name="clonar_para" value="Perfil existente">
                <label for="perfilVelho">Perfil existente</label>
                <input type="radio" id="perfilNovo" name="clonar_para" value="Perfil novo">
                <label for="perfilNovo">Perfil novo</label>
            </fieldset>
            <div>
                <label for="input_nome">Nome da comunidade ou do perfil:</label>
                <input type="text" id="input_nome">
            </div>
            <input type="submit" value="clonar" style="display: block; margin: 1rem auto">
        `;
        form.style.height = "100%";
        form.style.display = "flex";
        form.style.flexDirection = "column";
        form.style.justifyContent = "space-evenly";
        form.style.alignItems = "center";
        modalBody.appendChild(form);

        let currentView = document.getElementById("view");
        
        form.addEventListener("submit", e => {
            let clonarParas = document.querySelectorAll('input[name="clonar_para"]');
            let clonarPara;
            console.log("clonarParas:", clonarParas);
            clonarParas.forEach(radiobutton => {
                if (radiobutton.checked) {
                    clonarPara = radiobutton.value;
                }
            });

            let nome = document.getElementById("input_nome").value;
            
            if (clonarPara === "Perfil existente") {
                fetch(`${urlServidor}/api/pessoas/${nome}`)
                .then(res => {
                    return res.json();
                }).then(pessoaInteira => {

                    pessoaInteira.html = currentView.innerHTML;

                    fetch(`${urlServidor}/api/pessoas/${nome}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(pessoaInteira)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/pessoas/${nome}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            navigateTo(`/pessoa/${nome}`);
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (clonarPara === "Perfil novo") {
                fetch(`${urlServidor}/api/pessoas/`)
                .then(res => {
                    return res.json();
                }).then(pessoasTodas => {

                    let pessoaNova = {
                        "id": Array.from(pessoasTodas).length,
                        "tipo": "pessoa",
                        "nome": nome,
                        "descricao": "descrição",
                        "conjuntoDeLinguagem": {artigo: ["e"], pronome: ["elu"], flexao: ["-e"]},
                        "comunidades": [],
                        "html": currentView.innerHTML
                    }

                    fetch(`${urlServidor}/api/pessoas`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(pessoaNova)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/pessoas/${nome}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            navigateTo(`/pessoa/${nome}`);
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (clonarPara === "Comunidade existente") {
                fetch(`${urlServidor}/api/comunidades/${nome}`)
                .then(res => {
                    return res.json();
                }).then(comunaInteira => {

                    comunaInteira.html = currentView.innerHTML;

                    fetch(`${urlServidor}/api/comunidades/${nome}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(comunaInteira)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/comunidades/${nome}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            navigateTo(`/${nome}`);
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (clonarPara === "Comunidade nova") {
                console.log("clonando para comunidade nova");
                fetch(`${urlServidor}/api/comunidades/`)
                .then(res => {
                    return res.json();
                }).then(comunasTodas => {

                    let comunaNova = {
                        "id": Array.from(comunasTodas).length,
                        "tipo": "comunidade",
                        "nome": nome,
                        "descricao": "descrição",
                        "conjuntoDeLinguagem": {artigo: ["e"], pronome: ["elu"], flexao: ["-e"]},
                        "html": currentView.innerHTML
                    }

                    fetch(`${urlServidor}/api/comunidades/`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(comunaNova)
                    }).then(res1 => {
                        fetch(`${urlServidor}/api/comunidades/${nome}`)
                        .then(res2 => {
                            return res2.json();
                        }).then(paginaAtualizada => {
                            navigateTo(`/${nome}`);
                        })
                    }).catch(erro => console.log(erro));
                });
            } else if (location.pathname === "/") {
                console.log("não é possível clonar para a maloca")
            } else {
                console.log(e+":", "endereço inválido");
            }

            e.preventDefault();
            closeModal();
        });
        modal.style.display = "block";
    });

    // modal info
    let btnInfo = document.getElementById("btn-info");
    btnInfo.addEventListener("click", e => {
        /* lógica
            1. verifica se é usuarie, comunidade ou instância
            1. faz fetch dos dados
            2. se *pessoa*, cria elementos com as infos:
                - nome @ instancia (+ papéis)
                - avatar + imagem de fundo
                - comunidades (com papéis) + botão "ver mais"
                - tempo na instância
                - itens
            3. se *comunidade* cria elementos com as infos:
                - nome @ instancia (+ papéis)
                - avatar + imagem de fundo
                - confederações / alianças (como chamar?)
                - usuáries (com papéis) + botão "ver mais"
                - tempo na instância
                - itens que produz
                - botão "participar da comunidade"
            4. se *instância* cria elementos com as infos:
                - nome + avatar/símbolo
                - instâncias federadas
                - comunidades (com papéis) + botão "ver mais"
                - usuáries (com papéis) + botão "ver mais"
                - tempo de existência
        */
    });

});