class Tooltip extends HTMLElement {
    // Element gets created here but not attached to DOM
    constructor() {
        super();
        // Naming convention to replicate the behaviour of a private member of this class.
        this._tooltipContainer;
        this._tooltipText = 'Dummy tooltip.';

        /*  Unlock Shadow Dom. A shadow dom tree is being attached to the HTMLElement. 
            The styling and new children are not attached to the actual DOM but to the Shadow DOM now.
            and any external(global) styling does not affect the Shadow Dom tree elements.
            Mode: Open makes this shadow DOM accessible from outside.
        */
        this.attachShadow({mode: 'open'});
        
        /* In order to have a fully reusable component, this template also needs to be in the JS file so that
            we would only need to dump that JS file and use this component anywhere and not worry about separate 
            template contents
        // const template = document.querySelector('#tooltip-template');
        // // cloneNode method true is to clone all the elements under this template ( deep clone ).
        // this.shadowRoot.appendChild(template.content.cloneNode(true));
        */

        this.shadowRoot.innerHTML = `<slot>Some Default</slot>
                                     <span> (?)</span>`;
    }

    // Element gets attached to the DOM here.
    connectedCallback() {
        // Fetch the attribute on this HTMLElement.
        if(this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');      
        }
        const tooltipIcon = this.shadowRoot.querySelector('span');
        // const tooltipIcon = document.createElement('span');
        tooltipIcon.textContent = ' (?)';
        tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        /*  The new children are not attached to the actual(light) DOM, instead they are now attached
            to the shadow ROOT. Visually it doesn't change much.
        */
        // this.appendChild(tooltipIcon);
        this.shadowRoot.appendChild(tooltipIcon);
        this.style.position = 'relative';
    }

    // Naming convention to replicate the behaviour of a private member of this class.
    _showTooltip() {
        /* Instead of adding these individual lines of HTML and styling,
        we could you HTML's inbuit feature of template element.
            // this._tooltipContainer = document.createElement('div');
            // this._tooltipContainer.textContent = this._tooltipText;
            // this._tooltipContainer.style.backgroundColor = 'black';
            // this._tooltipContainer.style.color = 'white';
            // this._tooltipContainer.style.position = 'absolute';
            // this._tooltipContainer.style.zIndex = '10';
        */
       this._tooltipContainer = document.createElement('div');
            this._tooltipContainer.textContent = this._tooltipText;
            this._tooltipContainer.style.backgroundColor = 'black';
            this._tooltipContainer.style.color = 'white';
            this._tooltipContainer.style.position = 'absolute';
            this._tooltipContainer.style.zIndex = '10';
        this.shadowRoot.appendChild(this._tooltipContainer);
    }

    _hideTooltip() {
        this.shadowRoot.removeChild(this._tooltipContainer);
    }
}

customElements.define('uc-tooltip', Tooltip);