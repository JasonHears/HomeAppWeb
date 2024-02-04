import * as model from "./model.js";
import mortgageCalcInputView from "./views/mortgageCalcInputView.js";

import * as M from "../lib/materialize-src/js/bin/materialize";

import "core-js/stable"; // transpiling backwards support
import "regenerator-runtime/runtime"; // polyfill async await

controlLoanCalculation = async function (calcInput) {
  console.log("controlLoanCalculation()", calcInput);
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

  console.log("inputform:", objData);

  // guard if any values are blank
  if (Object.values(objData).includes("")) return;

  // run calculator
  await model.calculateMortgage(objData);
};

const init = function () {
  // console.log("init()");
  mortgageCalcInputView.addHandlerCalculatorUpdate(controlLoanCalculation);
};

init();

// Materialize -- ToDo: move to own handler class
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, { class: "calulator-select" });
});
