// converte caminho em expressão regex
export function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
}

// retorna parâmetros do caminho (ex: nome para rota /pessoa/:nome) em formato { key1: value, key2: value, ...}
export function getParams(match) {
    const values = match.result.slice(1); // retorna array com o valor dos parâmetros (ex: ['dani'])
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]); // retorna array com as chaves, como definidas na especificação das rotas (ex: ['nome'])

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

// usa history api para salvar navegação,
// permitindo que o navegador volte e avance páginas
export async function navigateTo(url, router, routes) {
    history.pushState(null, url, url);
    let view = await router(routes);
    return view;
}