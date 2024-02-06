import * as model from "./model.js";
import mortgageCalcInputView from "./views/mortgageCalcInputView.js";
import mortgageCalcDisplayView from "./views/mortgageCalcDisplayView.js";
import mortgageCalcControlsView from "./views/mortgageCalcControlsView.js";
import * as config from "./config.js";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import "core-js/stable"; // transpiling backwards support
import "regenerator-runtime/runtime"; // polyfill async await

controlLoanCalculation = function (calcInput) {
  // process input values into state.calculator
  const objData = {};
  Array.from(
    calcInput.target
      .closest(".calculator-input")
      .querySelectorAll("input, select")
  )
    .filter((node) => {
      return node.classList.contains("calculator-field");
    })
    .forEach((input) => {
      objData[input.id] = input.value;
    });

  model.updateCalculator(objData);

  // guard if calculator cannot calculate
  if (!model.isCalculatorValid()) {
    mortgageCalcDisplayView.render(); // renders the default display
    return;
  }

  model.calculateMortgage();
  mortgageCalcDisplayView.render(model.state);
};

controlToggles = function (e) {
  const toggle = e.target.name;
  model.state.controls[toggle] = !model.state.controls[toggle];

  // show/hide the appropriate field
  if (toggle === config.TOGGLE_CALC_TYPE)
    mortgageCalcInputView.toggleCalculator();
  if (toggle === config.TOGGLE_PROPERTY_TAX)
    mortgageCalcInputView.togglePropertyTax();
  if (toggle === config.TOGGLE_INSURANCE)
    mortgageCalcInputView.toggleInsurance();
  if (toggle === config.TOGGLE_PMI) mortgageCalcInputView.togglePMI();

  // guard if calculator cannot calculate
  if (!model.isCalculatorValid()) {
    mortgageCalcDisplayView.render();
    return;
  }

  model.calculateMortgage();
  mortgageCalcDisplayView.render(model.state);
};

const init = function () {
  // set up state object data
  model.state.controls[config.TOGGLE_CALC_TYPE] = false;
  model.state.controls[config.TOGGLE_PROPERTY_TAX] = false;
  model.state.controls[config.TOGGLE_INSURANCE] = false;
  model.state.controls[config.TOGGLE_PMI] = false;
  model.state.user.locale = navigator.language;

  mortgageCalcInputView.addHandlerCalculatorUpdate(controlLoanCalculation);

  mortgageCalcControlsView.render([1, 2]); // render control switches HACK: [1,2]
  mortgageCalcControlsView.addHandlerRadioSwitches(controlToggles);
};

init();
