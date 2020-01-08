class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    /* Height in vh is viewport height, i/e window height */
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }

                #modal {
                    z-index: 100;
                    position: fixed;
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    background: white;
                    // height: 30rem;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease-out;
                }

                header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }

                header h2 {
                    font-size: 1.25rem;
                }

                ::slotted(h2) {
                    font-size: 1.25rem;
                    margin: 0;
                }

                #main {
                    padding: 1rem;
                }

                #actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                } 

                #actions button {
                    margin: 0 0.25rem;
                }


                /* For the opened attribute on this host element */
                :host([opened]) #backdrop, 
                :host([opened]) #modal{
                    opacity: 1;
                    pointer-events: all;
                }

                :host([opened]) #modal{
                    top: 15vh;
                }
            </style>
            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <!-- <h2> Please confirm </h2> 
                        The first slot catches all the slotted items. Hence we need to identify our slots with names.
                        We can still pass default slot content .
                    -->
                    <slot name="title">Please confirm payment</slot>
                </header>
                <section id="main">
                    <!-- The unnamed slot takes the rest of the slotted items -->
                    <slot></slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Okay</button>
                </section>
            </div>
        `;

        /* We can do this because slots are nomal HTML tags */            
        const slots = this.shadowRoot.querySelectorAll('slot');
        /* This slotchange event is triggered when this slot is rendered */
        slots[1].addEventListener('slotchange', event => {
            /* assignedNodes gives all the text nodes including spaces in this html element */
            console.dir(slots[1].assignedNodes());
        });

        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');

        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));

        // cancelButton.addEventListener('cancel', () => {
        //     /*  
        //         Our dispatched event on the cancel button only reaches its target element which 
        //         is this cancel button and does not go outside this button when the event is created without
        //         the bubbles property.
        //     */
        //     console.log('Cancel inside the component');
        // });


        /* Close the modal on clicking the backdrop */
        const backdrop = this.shadowRoot.querySelector('#backdrop');
        backdrop.addEventListener('click', this._cancel.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == 'opened') {
            if (this.hasAttribute('opened')) {
                this.isOpen = true;
                // this.shadowRoot.querySelector('#modal').style.opacity = 1;
                // this.shadowRoot.querySelector('#modal').style.pointerEvents = all;
                // this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
                // this.shadowRoot.querySelector('#backdrop').style.pointerEvents = all;
            } else {
                this.isOpen = false;
            }
        }
    }

    // static get observedAttributes() {
    //     return ['opened'];
    // }
    /* There is no '_' in the method name as this is meant to be a public method. 
        Because for modals, we may want to access the open and hide methods from outside.
    */
    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if(this.hasAttribute('opened')) {
            this.removeAttribute('opened');
            this.isOpen = false;
        }
    }

    _cancel(event) {
        /*
            composed: true --> This event may leave this shadow DOM.
            bubbles: true --> event can reach the top most parent that handles this event.
        */
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
        this.hide();
    }

    _confirm(event) {
        this.hide();
        const confirmEvent = new Event('confirm');
        /*
            Here we do not need the additional properties of bubbles and confirmed because
            we are dispatching this event on our custom element itself and not inside any other element in the 
            shadow DOM. Therefore listeners on our element can listen to this. But this event will no longer
            bubble up.
        */
        this.dispatchEvent(confirmEvent);
    }
}

customElements.define('uc-modal', Modal);