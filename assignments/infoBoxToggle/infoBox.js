class InfoBoxToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                #info-box {
                    display: none;
                }
            </style>
            <p id="info-box">More infos!</p>
        `;
    }

    connectedCallback() {

    }
}