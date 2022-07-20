import AbstractView from './AbstractView.js';

export default class extends AbstractView {
	constructor(urlCliente) {
		super({
			urlCliente:	urlCliente,
			view: 			'registro'
		});
		this.setTitle('Inscrever-se');
	}
}