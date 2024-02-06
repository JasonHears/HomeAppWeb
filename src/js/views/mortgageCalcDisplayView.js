import View from "./View.js";
import * as helper from "../helper.js";
import * as config from "../config.js";

class mortgageCalcDisplayView extends View {
  _parentElement = document.querySelector(".calculator-display");
  _message = "Enter your loan information.";
  _errorMessage = "Invalid loan information.";

  renderError(message = this._message) {
    const markup = `
      <div class="calculator-display__amount">--</div>
      <div class="calculator-display__label calculator-mode">
        ${message}
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _getDisplay(toggleControl) {
    return toggleControl === config.CALC_TYPE_MONTHLY
      ? this._data.results.monthly
      : this._data.results.amount;
  }

  _getLabel(toggleControl) {
    return toggleControl === config.CALC_TYPE_MONTHLY
      ? "Estimated Monthly Payment"
      : "Estimated Loan Amount";
  }

  _generateMarkup() {
    return `
      <div class="calculator-display__amount">${helper.formatCurrency(
        this._getDisplay(this._data.controls[config.TOGGLE_CALC_TYPE]),
        "en-US",
        "USD"
      )}</div>
      <div class="calculator-display__label calculator-mode">
        ${this._getLabel(this._data.controls[config.TOGGLE_CALC_TYPE])}
      </div>
    `;
  }
} // class

export default new mortgageCalcDisplayView();
