class MLink extends HTMLElement {
    constructor() {
        super();

        let html = `
        <div class="link">

            <slot></slot>

            <style>

                .link {
                    text-decoration: underline;
                    cursor: pointer;
                }
                
            </style>
        </div>
        `

        let template = document.createElement('template');
        template.innerHTML = html;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.firstElementChild.cloneNode(true));
    }

    connectedCallback() {
        if (!this.hasAttribute('data-link')) {
            this.setAttribute('data-link', '');
        }
    }

    static get observedAttributes() {
        return ['data-link', 'href'];
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
    }

    get dataLink() {
        return this.getAttribute('data-link');
    }
      
    set dataLink(isDataLink) {
        if (isHidden) {
            this.setAttribute('data-link', '');
        } else {
            this.removeAttribute('data-link');
        }
    }

    get href() {
        return this.getAttribute('href');
    }

    set href(rumo) {
        this.setAttribute('href', rumo);
    }
}

window.customElements.define('m-link', MLink);