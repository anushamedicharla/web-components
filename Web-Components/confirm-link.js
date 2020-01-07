class ConfirmLink extends HTMLAnchorElement {
    connectedCallback() {
        /* adding the click listener directly to this custom anchor tag element */
        this.addEventListener('click', event => {
            /*  confirm is a built in method in JS 
                https://www.geeksforgeeks.org/javascript-window-confirm-method/
            */
            if(!confirm('Do you really want to leave?')) {
                event.preventDefault();
            }
        });
    }
}
/*  Whenever we extend a non HTMLElement to this class, we need to pass in a 3rd argument to 
    this define method. That specifies which element would this custom elememt extend, i.e 
    add functionality to. 
*/
customElements.define('uc-confirm-link', ConfirmLink, { extends: 'a' });