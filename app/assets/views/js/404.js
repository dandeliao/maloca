import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(urlCliente) {
		super({
			urlCliente:	urlCliente,
			view: 			'404'
		});
		this.setTitle('404 - página não existe');
	}
}