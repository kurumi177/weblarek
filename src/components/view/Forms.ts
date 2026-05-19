import { Form } from "../common/Form";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class OrderForm extends Form<IBuyer> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._card = container.querySelector('button[name="card"]') as HTMLButtonElement;
        this._cash = container.querySelector('button[name="cash"]') as HTMLButtonElement;

        if(this._card) this._card.addEventListener('click', () => this.setPayment('card'));
        if(this._cash) this._cash.addEventListener('click', () => this.setPayment('cash'));
    }

    setPayment(method: 'card' | 'cash') {
        this._card.classList.toggle('button_alt-active', method === 'card');
        this._cash.classList.toggle('button_alt-active', method === 'cash');
        this.events.emit('order.payment:change', { field: 'payment', value: method });
    }
    
    set address(value: string) { (this.container.elements.namedItem('address') as HTMLInputElement).value = value; }
}

export class ContactsForm extends Form<IBuyer> {
    constructor(container: HTMLFormElement, events: IEvents) { super(container, events); }
    set phone(value: string) { (this.container.elements.namedItem('phone') as HTMLInputElement).value = value; }
    set email(value: string) { (this.container.elements.namedItem('email') as HTMLInputElement).value = value; }
}