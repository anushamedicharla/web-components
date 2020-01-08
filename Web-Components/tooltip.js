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

        this.shadowRoot.innerHTML = `
        <style>
            div {
                font-weight: normal;
                background-color: black;
                color: white;
                position : absolute;
                top: 1.5rem;
                left: 0.57rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
            }

            /*
                We cannot use the selector of uc-tooltip here in order to select and style our entire element.
                instead we have this 'host' selector to style this element. Of course this would act as a default 
                styling and any styling in the real DOM for this element ( using the tag uc-tooltip ) would have more 
                specificity and would override this styling.
            */
            :host {
                background: #ccc;
            }

            /*
                Lets say we have a class "important" attached to our host element. We cannot just use :host.important
                type of selector to use it. Instead we use :host(.important) {} as the host also is a function that 
                takes in a selector to add the styling conditionally to that particular selector.
            */
            :host(.important) {
                /*  We use this variable using the var method here. If that value is not available, this fallback 
                    value of #ccc that we mentioned here gets applied. */
                background: var(--color-primary, #ccc);
            }

            /*
                We can specify the  context in which the styling needs to be applied for this host with
                :host-context method.           
            */
            :host-context(p.hello) {
                font-weight: bold;
            }

            .icon {
                background-color: black;
                color: white;
                padding: 0.15rem 0.5rem;
                text-align: center;
                border-radius: 50%;
            }
            .highlight {
                background: red;
            }
            /*  In order to style the slotted content in the 
                shadow DOM, we need to use ::slotted {} selector in the shadow DOM styling. 
                We can only selected the top most slotted content . for example we cannot select an 'a' tag 
                under this .highlight class. The styling in the real DOM overrides the styling in the shadow DOM.
                So this styling could be a default set styling. 
            */
            ::slotted(.highlight) {
                // border-bottom: 1px solid red;
            }
        </style>
            <slot>Some Default</slot>
            <span class="icon">?</span>
        `;
    }

    /* Lifecycle Hook : At this point of time this element gets attached to the real DOM.
    */
    connectedCallback() {

        // Fetch the attribute on this HTMLElement.
        if(this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');      
        }
        const tooltipIcon = this.shadowRoot.querySelector('span');
        // const tooltipIcon = document.createElement('span');
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