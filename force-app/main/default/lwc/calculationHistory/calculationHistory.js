import { LightningElement, api } from 'lwc';

export default class CalculationHistory extends LightningElement {
    @api calculations = []; // Received from parent

    handleSelect(event) {
        const selectedValue = event.target.dataset.value;
        // Dispatches event to parent with selected calculation
        this.dispatchEvent(new CustomEvent('calculationselected', { detail: selectedValue }));
    }
}
