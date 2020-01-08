class Tooltip extends HTMLElement {
    // Element gets created here but not attached to DOM
    constructor() {
        super();
        // Naming convention to replicate the behaviour of a private member of this class.
        // this._tooltipContainer;
        this._tooltipIcon;
        this._tooltipVisible = false;
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
                position: relative;
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
        this._tooltipIcon = this.shadowRoot.querySelector('span');
        // const tooltipIcon = document.createElement('span');
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        /*  The new children are not attached to the actual(light) DOM, instead they are now attached
            to the shadow ROOT. Visually it doesn't change much.
        */
        // this.appendChild(_tooltipIcon);
        this.shadowRoot.appendChild(this._tooltipIcon);
        // this.style.position = 'relative';
    }

    /*
        Attribute changes do not get picked up because we have no logic for that in the component. The "text"
        attribute is extracted in connectedCallback (i.e when the component gets mounted to the DOM) only.
        For this we have a new lifecycle hook: attributeChangedCallback()
        This gets executed when an Observed attribute is updated. Observed because this is a great optimization
        technique in JS now. All attributes do not get watched automatically. 
        We need to explicitly observe these attributes.
    */

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(name, oldVal, newVal);
        if( oldVal === newVal) {
            return;
        }
        if( name === 'text') {
            // i.e for 'text' attribute changes
            this._tooltipText = newVal;
        }
    }

    /*
        This will be called when the element will be removed from the real DOM.
        A great place for any cleanup work.
    */
    disconnedtedCallback() {
        console.log('Disconnedted');
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    static get observedAttributes() {
        /*  This is like a property of this class but its not. We cannot set this property. 
            we can only get this and this is accessible from outside this class. Like a locked down 
            property. We return the observed properties here.
        */
        return ['text'];
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
        // this._tooltipContainer = document.createElement('div');
        // this._tooltipContainer.textContent = this._tooltipText;
            // this._tooltipContainer.style.backgroundColor = 'black';
            // this._tooltipContainer.style.color = 'white';
            // this._tooltipContainer.style.position = 'absolute';
            // this._tooltipContainer.style.zIndex = '10';
        // this.shadowRoot.appendChild(this._tooltipContainer);

        this._tooltipVisible = true;
        this._render();
    }

    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
        // this.shadowRoot.removeChild(this._tooltipContainer);
    }


    /* 
        A private method responsible for updating the DOM.    
        It is cleaner to add all the logic of rendering things to the DOM in one place.
    */
    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if( this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if(tooltipContainer) {
                 this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }
}

customElements.define('uc-tooltip', Tooltip);