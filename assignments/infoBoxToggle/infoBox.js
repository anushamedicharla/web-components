class InfoBoxToggle extends HTMLElement {
    constructor() {
        super();
        // Shadow DOM so that we can style everything encapsulated and have our own DOM structure in there.
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                #info-box {
                    display: none;
                }
            </style>
            <button>Show</button>
            <p id="info-box"><slot></slot></p>
        `;

        this._button = this.shadowRoot.querySelector('button');
        this._infoEl = this.shadowRoot.querySelector('p');
        this._isHidden = true;
        
    }

    connectedCallback() {
        /* We will access attribute of the custom element being rendered into the Real DOM .
            Hence we write this here
        */
       if(this.hasAttribute('is-visible')) {
           if(this.getAttribute('is-visible') === 'true') {
            this._isHidden = false;
            this._infoEl.style.display = 'block';
            this._button.innerText = 'Hide';
           }
       }
        this._button.addEventListener('click', this._toggleInfoBox.bind(this));
    }

    _toggleInfoBox() {
        this._isHidden = !this._isHidden;
        this._infoEl.style.display = this._isHidden ? 'none' : 'block';
        this._button.innerText = this._isHidden ? 'Show' : 'Hide';
    }
}

customElements.define('uc-info-toggle', InfoBoxToggle);