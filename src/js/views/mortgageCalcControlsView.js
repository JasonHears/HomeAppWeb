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

  /**
   * Generates markup for a switch control
   * @param {String} title primary switch label
   * @param {String} name switch name within HTML
   * @param {String} label1 label of the primary position
   * @param {String} label2 label of the secondary position
   * @param {Array} options [checked specifies which switch to default to one]
   * @returns
   */
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

  /**
   * Generates the HTML markup for this _parentElement
   * @returns {String}
   */
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

  /**
   * Adds change handler to radio "switches"
   * @param {*} handler callback handler function
   */
  addHandlerRadioSwitches(handler) {
    document.querySelectorAll("input[type='radio']").forEach((elm) => {
      elm.addEventListener("change", function (e) {
        handler(e);
      });
    });
  }
} // class

export default new mortgageCalcControlsView();
