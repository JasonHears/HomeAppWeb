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

  // run calculator
  model.calculateMortgage();

  // render results
  mortgageCalcDisplayView.render(model.state);
};

controlToggles = function (e) {
  const toggle = e.target.name;
  model.state.controls[toggle] = !model.state.controls[toggle];

  switch (toggle) {
    case config.TOGGLE_CALC_TYPE:
      // toggle calculator input view
      mortgageCalcInputView.toggleCalculator();
      break;

    case config.TOGGLE_PROPERTY_TAX:
      // show/hide field
      mortgageCalcInputView.togglePropertyTax();
      break;
    case config.TOGGLE_INSURANCE:
      mortgageCalcInputView.toggleInsurance();
      break;
  }

  // guard if calculator cannot calculate
  if (!model.isCalculatorValid()) {
    mortgageCalcDisplayView.render();
    return;
  }
  // calculate
  model.calculateMortgage();
  // update display
  mortgageCalcDisplayView.render(model.state);
};

const init = function () {
  // set up state object data
  model.state.controls[config.TOGGLE_CALC_TYPE] = false;
  model.state.controls[config.TOGGLE_PROPERTY_TAX] = false;
  model.state.controls[config.TOGGLE_INSURANCE] = false;
  model.state.user.locale = navigator.language;

  mortgageCalcInputView.addHandlerCalculatorUpdate(controlLoanCalculation);

  mortgageCalcControlsView.render([1, 2]);
  mortgageCalcControlsView.addHandlerCalculationTypeSwitch(controlToggles);
};

init();
