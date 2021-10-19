import Inicio from "./views/Inicio.js"
import Perfil from "./views/Perfil.js"
import Pessoa from "./views/Pessoa.js"
import Comunidade from "./views/Comunidade.js"
import Error404 from "./views/Error404.js";

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
        { path: "/pessoa/eu", view: Perfil},
        { path: "/pessoa/:nome", view: Pessoa},
        { path: "/:nome", view: Comunidade}
    ];

    // Testa se as rotas correspondem ao caminho atual
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
            //isMatch: location.pathname === route.path
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
    
    // links para router
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

    // botão editar
    let btnEditar = document.getElementById("btn-editar");
    btnEditar.addEventListener("click", e => {
        let popup = document.createElement('div')
        popup.setAttribute("id", "popup");
        let popupStyle = document.createElement('style');

        popupStyle.innerHTML = `
            #popup {
                position: fixed;
                background: white;
                width: 86%;
                min-height: 300px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);                
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
                
                z-index: 1000;
            }
        `;

        document.head.appendChild(popupStyle);
        document.body.appendChild(popup);

    });

});