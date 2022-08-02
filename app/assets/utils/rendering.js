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

export async function renderView (view) {

	try {

		document.querySelector("#viewer").innerHTML = await view.getHtml(); // renderiza view
		return 'rendered';

	} catch (erro) {
		if (erro.message === '401') { // não está logade
			return '401'
		} else {
			return 'failed'
		}
	}
}