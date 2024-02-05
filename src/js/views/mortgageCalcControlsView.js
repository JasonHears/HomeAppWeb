import View from "./View.js";

import { TOGGLE_CALC_TYPE } from "../config.js";

class mortgageCalcControlsView extends View {
  _parentElement = document.querySelector(".calculator-controls");
  _message = "";
  _error = "";

  _generateMarkup() {
    return `
    `;
  }

  addHandlerCalculationTypeSwitch(handler) {
    // handle calculation-type switch
    document
      .querySelector(".switch.calculation-type")
      .addEventListener("change", function (e) {
        handler(TOGGLE_CALC_TYPE);
      });
  }
} // class

export default new mortgageCalcControlsView();
