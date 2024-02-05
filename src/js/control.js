import * as model from "./model.js";
import mortgageCalcInputView from "./views/mortgageCalcInputView.js";
import mortgageCalcDisplayView from "./views/mortgageCalcDisplayView.js";
import mortgageCalcControlsView from "./views/mortgageCalcControlsView.js";
import * as config from "./config.js";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import "core-js/stable"; // transpiling backwards support
import "regenerator-runtime/runtime"; // polyfill async await

_validateInput = function (inputObj) {
  return (
    // validate interest and term are not blank
    inputObj.interest_rate !== "" &&
    inputObj.loan_term !== "" &&
    // validate loan amount or payment is not blank based on calculation type
    ((model.state.controls[config.TOGGLE_CALC_TYPE] ===
      config.CALC_TYPE_MONTHLY &&
      inputObj.mnth_loan_amount !== "") ||
      (model.state.controls[config.TOGGLE_CALC_TYPE] ===
        config.CALC_TYPE_AMOUNT &&
        inputObj.amt_payment !== ""))
  );
};

controlLoanCalculation = async function (calcInput) {
  // process input values
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

  // guard if any values are blank
  if (!_validateInput(objData)) return;

  // run calculator
  await model.calculateMortgage(objData);

  // render results
  await mortgageCalcDisplayView.render(model.state);
};

controlToggles = async function (e) {
  const toggle = e.target.name;
  model.state.controls[toggle] = !model.state.controls[toggle];

  if (toggle === config.TOGGLE_CALC_TYPE) {
    // toggle calculator input view
    mortgageCalcInputView.toggleCalculator();

    // update display
    mortgageCalcDisplayView.render(model.state);
  }
};

const init = function () {
  // set up state object data
  model.state.controls[config.TOGGLE_CALC_TYPE] = false;
  model.state.controls[config.TOGGLE_PROPERTY_TAX] = false;
  model.state.user.locale = navigator.language;

  mortgageCalcInputView.addHandlerCalculatorUpdate(controlLoanCalculation);

  mortgageCalcControlsView.render([1, 2]);
  mortgageCalcControlsView.addHandlerCalculationTypeSwitch(controlToggles);
};

init();
