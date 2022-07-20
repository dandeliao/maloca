
// converte caminho em expressão regex?
export function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
}

// retorna parâmetros que correspondem a uma expressão regex?
export function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

// usa history api para salvar navegação,
// permitindo que o navegador volte e avance páginas
export function navigateTo(url, router, routes) {
    history.pushState(null, url, url);
    router(routes);  
}