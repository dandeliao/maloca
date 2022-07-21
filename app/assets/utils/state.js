export const estadoInicial = {
	tipo: 				'comunidade',
	id:	  				0,
	pagina:				0,
	titulo: 			'maloca (início)',
	modosHabilitados:	['menu', 'inicio', 'clonar', 'info'],
	modoAtivo:			'ver'
}

export function getState() {
	return JSON.parse(localStorage.getItem('estado'));
}

export function setState(estado) {
	localStorage.setItem('estado', JSON.stringify(estado));
}