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

  _generateMarkup() {
    let display, label;
    if (
      this._data.controls[config.TOGGLE_CALC_TYPE] == config.CALC_TYPE_MONTHLY
    ) {
      display = this._data.results.monthly;
      label = "Estimated Monthly Payment";
    }

    if (
      this._data.controls[config.TOGGLE_CALC_TYPE] == config.CALC_TYPE_AMOUNT
    ) {
      display = this._data.results.amount;
      label = "Estimated Loan Amount";
    }

    return `
    <div class="calculator-display__amount">${helper.formatCurrency(
      display,
      "en-US",
      "USD"
    )}</div>
    <div class="calculator-display__label calculator-mode">
      ${label}
    </div>
    `;
  }
} // class

export default new mortgageCalcDisplayView();
