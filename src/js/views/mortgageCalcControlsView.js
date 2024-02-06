import View from "./View.js";

import {
  TOGGLE_CALC_TYPE,
  TOGGLE_PROPERTY_TAX,
  TOGGLE_INSURANCE,
} from "../config.js";

class mortgageCalcControlsView extends View {
  _parentElement = document.querySelector(".calculator-controls");
  _message = "";
  _error = "";

  _generateControlMarkup(
    title,
    name,
    label1,
    label2,
    options = { checked: 1 }
  ) {
    return `
      <div class="calculator-controls__row">
        <div class="calculator-controls__label">
          ${title}
        </div>

        <input
          type="radio"
          class="btn-check calculation-type__switch"
          name="${name}"
          id="${name}-1"
          autocomplete="off"
          ${options.checked === 1 ? "checked" : ""}
        />
        <label
          class="btn calculator-controls__btn"
          for="${name}-1"
          >${label1}</label
        >

        <input
          type="radio"
          class="btn-check calculation-type__switch"
          name="${name}"
          id="${name}-2"
          autocomplete="off"
          ${options.checked === 2 ? "checked" : ""}
        />
        <label
          class="btn calculator-controls__btn"
          for="${name}-2"
          >${label2}</label
        >
      </div>
    `;
  }

  _generateMarkup() {
    return (
      this._generateControlMarkup(
        "Toggle Monthly Payment vs Loan Amount",
        TOGGLE_CALC_TYPE,
        "Monthly Payment",
        "Loan Amount"
      ) +
      this._generateControlMarkup(
        "Include Annual Property Tax",
        TOGGLE_PROPERTY_TAX,
        "No",
        "Yes"
      ) +
      this._generateControlMarkup(
        "Include Annual Insurance",
        TOGGLE_INSURANCE,
        "No",
        "Yes"
      )
    );
  }

  addHandlerCalculationTypeSwitch(handler) {
    // handle calculation-type switch
    // passing in TOGGLE_CALC_TYPE to support additional toggles in the future

    document.querySelectorAll("input[type='radio']").forEach((elm) => {
      elm.addEventListener("change", function (e) {
        handler(e);
      });
    });
  }
} // class

export default new mortgageCalcControlsView();
