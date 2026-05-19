import { Component } from "../base/Component";

interface ISuccessActions { onClick: () => void; }

export class Success extends Component<{total: number}> {
    protected _close: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._close = container.querySelector('.order-success__close') as HTMLButtonElement;
        this._description = container.querySelector('.order-success__description') as HTMLElement;
        if (this._close) this._close.addEventListener('click', actions.onClick);
    }
    
    set total(value: number) { this._description.textContent = `Списано ${value} синапсов`; }
}