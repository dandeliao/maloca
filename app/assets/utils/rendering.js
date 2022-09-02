export function togglePressed (imgButton) {
	if (imgButton.pressed) {
		imgButton.pressed = false;
	} else {
		imgButton.pressed = true;
	}
}

export function renderNavBar(estado) {

	let navBar = document.getElementById('nav-bar');

	let titulo = navBar.querySelector('#view-title');
	titulo.innerText = 'modo ativo: ' + estado.modoAtivo;

	switch (estado.esquemaDeCores) {
		case 'rosa-claro':
			navBar.style.backgroundColor = '#ffb6c1';
			navBar.style.color = '#1B1B1B';
			break;
		case 'marrom-escuro':
			navBar.style.backgroundColor = '#674e48';
			navBar.style.color = '#EFEFEF';
			break;
	}

	let btns = navBar.querySelectorAll('img-button');
	btns.forEach(b => {

		if (estado.modoAtivo === b.id) {
			b.pressed = true;
		} else {
			b.pressed = false;
		}

		let habilitado = false;
		estado.modosHabilitados.forEach(m => {
			if (m === b.id) {
				habilitado = true;
			}
		});
		b.enabled = habilitado;
	});

	return 'rendered';
}

export async function renderTabBar (estado) {

    let tabBar = document.getElementById('tab-bar');

	while (tabBar.lastChild) {
		tabBar.removeChild(tabBar.lastChild);
	}

    if ((estado.tipo === 'pessoa') || (estado.tipo === 'comunidade')) {
		// caso seja view com páginas (pessoais ou comunitárias), exibe abas
        
		tabBar.classList.add('active');
		
		console.log('paginas:', estado.paginas);
		console.log('paginaAtiva', estado.paginaAtiva);

		estado.paginas.forEach(p => {
			let mtab = document.createElement('maloca-tab');
			mtab.texto = p.titulo;
			mtab.pageId = p.id;
			if (p.id == estado.paginaAtiva) { // há um problema de tipos: o comparador triplo (===) não funciona na renderização inicial. Solução provisória é usar ==
				mtab.selected = true;
			}
			tabBar.appendChild(mtab);
		})

		if (estado.modoAtivo === 'editar') {
			// exibe "X" em cada aba, o que permite deletar aba
			for (let i = 0; i < tabBar.children.length; i++) {
				tabBar.children[i].modoEditar = true;
			}
			// cria e exibe aba "+" que permite criar nova página
			let mtabPlus = document.createElement('maloca-tab');
			mtabPlus.texto = '+';
			mtabPlus.setAttribute('id', 'nova-pagina');
			tabBar.appendChild(mtabPlus);
		}

    } else {
        // caso contrário, oculta abas
        tabBar.classList.remove('active');
    }
}

export async function renderView (view) {

	try {

		document.querySelector("#viewer").innerHTML = await view.getHtml(); // renderiza view
		return 'rendered';

	} catch (erro) {
		if (erro.message === '401') { // não está logade
			return '401';
		} else if (erro.message === 'autenticade') {
			return 'autenticade';
		} else {
			return 'failed';
		}
	}
}