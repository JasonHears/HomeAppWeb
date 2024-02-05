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
    ((model.state.controls.calculationType === config.CALC_TYPE_MONTHLY &&
      inputObj.mnth_loan_amount !== "") ||
      (model.state.controls.calculationType === config.CALC_TYPE_AMOUNT &&
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

controlCalculatorToggle = async function (toggle) {
  if ((toggle = config.TOGGLE_CALC_TYPE)) {
    // toggle the calculation Type
    model.state.controls.calculationType =
      model.state.controls.calculationType === config.CALC_TYPE_MONTHLY
        ? config.CALC_TYPE_AMOUNT
        : config.CALC_TYPE_MONTHLY;

    // toggle calculator input view
    mortgageCalcInputView.toggleCalculator();

    // trigger calculation?

    // update display
    mortgageCalcDisplayView.render(model.state);
  }
};

const init = function () {
  mortgageCalcInputView.addHandlerCalculatorUpdate(controlLoanCalculation);
  mortgageCalcControlsView.addHandlerCalculationTypeSwitch(
    controlCalculatorToggle
  );

  model.state.user.locale = navigator.language;
};

init();
