export const estadoInicial = {
	meuId:				'',
	tipo: 				'comunidade',
	titulo: 			'maloca (início)',
	id:	  				1,
	paginas:			[{id: 1, titulo: 'inicio', publica: 'true'}],
	paginaAtiva:		null,
	modosHabilitados:	['menu', 'inicio', 'clonar', 'info'],
	modoAtivo:			'ver',
	esquemaDeCores:		'rosa-claro'
}

export function getState() {
	return JSON.parse(localStorage.getItem('estado'));
}

export function setState(estado) {
	localStorage.setItem('estado', JSON.stringify(estado));
}