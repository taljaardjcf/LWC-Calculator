import {
  LightningElement,
  track,
  wire
} from 'lwc';
import saveCalculation from '@salesforce/apex/CalculationController.saveCalculation';
import getCalculation from '@salesforce/apex/CalculationController.getCalculation';
import {
  ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class Calculator extends LightningElement {
  @track displayValue = '0';
  @track firstOperand = null;
  @track operator = null;
  @track waitingForSecondOperand = false;

  keys = [{
          value: "7",
          class: "key"
      }, {
          value: "8",
          class: "key"
      }, {
          value: "9",
          class: "key"
      }, {
          value: "÷",
          class: "key"
      },
      {
          value: "4",
          class: "key"
      }, {
          value: "5",
          class: "key"
      }, {
          value: "6",
          class: "key"
      }, {
          value: "x",
          class: "key"
      },
      {
          value: "1",
          class: "key"
      }, {
          value: "2",
          class: "key"
      }, {
          value: "3",
          class: "key"
      }, {
          value: "-",
          class: "key"
      },
      {
          value: "0",
          class: "key"
      }, {
          value: ".",
          class: "key"
      }, {
          value: "",
          class: "none"
      }, {
          value: "+",
          class: "key"
      }
  ];


  handleButtonClick(event) {
      const value = event.target.dataset.value;

      if (!isNaN(value) || value === '.') {
          this.handleNumber(value);
      } else {
          this.handleOperator(value);
      }
  }

  handleNumber(num) {
      if (num === '.' && this.displayValue.includes('.')) {
          return; // Prevent multiple decimal points
      }

      if (this.waitingForSecondOperand) {
          this.displayValue = num === '.' ? '0.' : num;
          this.waitingForSecondOperand = false;
      } else {
          this.displayValue =
              this.displayValue === '0' && num !== '.' ? num : this.displayValue + num;
      }
  }

  handleOperator(op) {
      if (op === 'C') return this.resetCalculator();
      if (op === '=' && this.operator) return this.calculateResult();

      this.firstOperand = this.firstOperand || parseFloat(this.displayValue);
      this.operator = op;
      this.waitingForSecondOperand = true;
  }

  calculateResult() {
      if (!this.firstOperand || !this.operator) return;
      let secondOperand = parseFloat(this.displayValue);
      let result;
      switch (this.operator) {
          case '+':
              result = this.firstOperand + secondOperand;
              break;
          case '-':
              result = this.firstOperand - secondOperand;
              break;
          case 'x':
              result = this.firstOperand * secondOperand;
              break;
          case '÷':
              result = secondOperand !== 0 ? this.firstOperand / secondOperand : 'Error';
              break;
      }
      this.displayValue = String(parseFloat(result.toFixed(10)));
      this.firstOperand = result;
      this.operator = null;
  }

  resetCalculator() {
      this.displayValue = '0';
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
  }

  async handleSaveCalculation() {
      try {
          await saveCalculation({
              value: this.displayValue
          });
          this.showToast('Success', 'Calculation saved!', 'success');
      } catch (error) {
          this.showToast('Error', error.body.message, 'error');
      }
  }

  async handleSearchCalculation() {
      try {
          const result = await getCalculation({
              value: this.displayValue
          });
          if (result) {
              this.displayValue = result.Value__c;
              this.showToast('Found', 'Calculation retrieved!', 'success');
          } else {
              this.showToast('Not Found', 'No matching calculation.', 'warning');
          }
      } catch (error) {
          this.showToast('Error', error.body.message, 'error');
      }
  }

  showToast(title, message, variant) {
      this.dispatchEvent(new ShowToastEvent({
          title,
          message,
          variant
      }));
  }
}