import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(urlCliente) {
		super({
			urlCliente:	urlCliente,
			view: 			'colecao'
		});
		this.setTitle('Minhas Comunidades');
	}
}