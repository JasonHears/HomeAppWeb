import View from "./View.js";

import { CALC_TYPE_MONTHLY, CALC_TYPE_AMOUNT } from "../config.js";

// import icons from "url:bootstrap-icons/bootstrap-icons.svg"; // FOR USE OF BOOTSTRAP ICONS

class MortgageCalcInputView extends View {
  _parentElement = document.querySelector(".calculator-monthly");
  _message = "Enter your loan information.";
  _error = "Invalid loan information.";

  _calcMonthly = document.querySelector(".calculator-monthly");
  _calcAmount = document.querySelector(".calculator-amount");

  _mnthLoanAmtInput = document.querySelector("#mnth_loan_amount");
  _amtPaymentInput = document.querySelector("#amt_payment");

  _loanIntRateInput = document.querySelector("#interest_rate");
  _loanTermInput = document.querySelector("#loan_term");

  toggleCalculator() {
    this._calcMonthly.classList.toggle("hidden");
    this._calcAmount.classList.toggle("hidden");
  }

  addHandlerCalculatorUpdate = function (handler) {
    this._mnthLoanAmtInput.addEventListener("keyup", handler);
    this._amtPaymentInput.addEventListener("keyup", handler);

    this._loanIntRateInput.addEventListener("keyup", handler);
    this._loanTermInput.addEventListener("change", handler);
  };

  _generateMarkup() {
    return "";
  }
} // class

export default new MortgageCalcInputView();
