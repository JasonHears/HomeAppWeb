import View from "./View.js";

class MortgageCalcInputView extends View {
  _parentElement = document.querySelector(".calculator-input");
  _errorMessage = `We were not able to calculate from your input.`;
  _message = `Please enter your loan details.`;

  _loanAmtInput = document.querySelector("#loan_amount");
  _loanIntRateInput = document.querySelector("#interest_rate");
  _loanTermInput = document.querySelector("#loan_term");

  addHandlerCalculatorUpdate(handler) {
    console.log("addHandlerCalculateLoan()");

    this._loanAmtInput.addEventListener("keyup", handler);
    this._loanIntRateInput.addEventListener("keyup", handler);
    this._loanTermInput.addEventListener("change", handler);
  }
} // class

export default new MortgageCalcInputView();
