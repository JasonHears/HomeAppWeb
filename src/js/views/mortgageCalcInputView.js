import View from "./View.js";

import { CALC_TYPE_MONTHLY, CALC_TYPE_AMOUNT } from "../config.js";

class MortgageCalcInputView extends View {
  _parentElement = document.querySelector(".calculator-monthly");
  _message = "Enter your loan information.";
  _error = "Invalid loan information.";

  _calcMonthly = document.querySelector(".calculator-monthly");
  _calcAmount = document.querySelector(".calculator-amount");

  _mnthLoanAmtInput = document.querySelector("#mnth_loan_amount");
  _mnthLoanIntRateInput = document.querySelector("#mnth_interest_rate");
  _mnthLoanTermInput = document.querySelector("#mnth_loan_term");

  _amtLoanAmtInput = document.querySelector("#amt_payment");
  _amtLoanIntRateInput = document.querySelector("#amt_interest_rate");
  _amtLoanTermInput = document.querySelector("#amt_loan_term");

  toggleCalculator() {
    this._calcMonthly.classList.toggle("hidden");
    this._calcAmount.classList.toggle("hidden");
  }

  addHandlerCalculatorUpdate = function (handler) {
    this._mnthLoanAmtInput.addEventListener("keyup", handler);
    this._mnthLoanIntRateInput.addEventListener("keyup", handler);
    this._mnthLoanTermInput.addEventListener("change", handler);

    this._amtLoanAmtInput.addEventListener("keyup", handler);
    this._amtLoanIntRateInput.addEventListener("keyup", handler);
    this._amtLoanTermInput.addEventListener("change", handler);
  };

  _generateMarkup() {
    return "";
  }
} // class

export default new MortgageCalcInputView();
