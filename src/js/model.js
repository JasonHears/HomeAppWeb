import * as config from "./config.js";

export const state = {
  calculator: {
    mnthLoanAmount: 0,
    amtPayment: 0,
    loanInterest: 0,
    termYears: 0,
    termType: "",
    propertyTax: 0,
    insurance: 0,
  },
  controls: {},
  results: {
    monthly: 0,
    amount: 0,
  },
  user: {
    locale: "en-US",
    currency: "USD",
  },
};

/**
 *
 * @returns {Number} Result of calculation for monthly payment
 */
const _calculateMonthly = function () {
  const calc = state.calculator;
  const interest = calc.loanInterest / 100 / 12;
  const numPayments = calc.termYears * 12;

  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  let result = Math.round((calc.mnthLoanAmount / discountFactor) * 100) / 100;

  // Property Tax Inclusion
  if (state.controls?.[config.TOGGLE_PROPERTY_TAX] && calc.propertyTax !== 0) {
    result += calc.propertyTax / 12;
  }

  // Property Insurance Inclusion
  if (state.controls?.[config.TOGGLE_INSURANCE] && calc.insurance !== 0) {
    result += calc.insurance / 12;
  }

  console.log("result: ", result);
  return result;
};

/**
 *
 * @returns {Number} Result of calculation for loan amount
 */
const _calculateAmount = function () {
  const calc = state.calculator;
  const interest = calc.loanInterest / 100 / 12;
  const numPayments = calc.termYears * 12;

  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  let adjustedPayment = calc.amtPayment;

  // Property Tax Inclusion
  if (state.controls?.[config.TOGGLE_PROPERTY_TAX] && calc.propertyTax !== 0) {
    adjustedPayment -= calc.propertyTax / 12;
  }

  // Property Insurance Inclusion
  if (state.controls?.[config.TOGGLE_INSURANCE] && calc.insurance !== 0) {
    adjustedPayment -= calc.insurance / 12;
  }

  let result = Math.round(adjustedPayment * discountFactor * 100) / 100;

  console.log("result: ", result);
  return result;
};

export const updateCalculator = function (data) {
  try {
    this.state.calculator = {
      mnthLoanAmount: +data.mnth_loan_amount,
      amtPayment: +data.amt_payment,
      loanInterest: +data.interest_rate,
      termYears: +`${+data.loan_term.split(",")[0]}`,
      termType: `${data.loan_term.split(",")[1]}`,
      propertyTax: +data.annual_property_tax,
      insurance: +data.annual_insurance,
    };
  } catch (error) {
    throw new Error("Issue updating calculator from input data.");
  }
};

export const calculateMortgage = function () {
  this.state.results.monthly = _calculateMonthly();
  this.state.results.amount = _calculateAmount();
};

/**
 * Returns whether or not calculator has valid inputs to run against
 * @returns {boolean} true if calculator is valid, false if not
 */
export const isCalculatorValid = function () {
  const calc = this.state.calculator;

  return (
    // validate interest and termYears are not 0
    calc.loanInterest !== 0 &&
    calc.termYears !== 0 &&
    // validate loan amount or payment is not 0 based on calculation type
    ((this.state.controls[config.TOGGLE_CALC_TYPE] ===
      config.CALC_TYPE_MONTHLY &&
      calc.mnthLoanAmount !== 0) ||
      (this.state.controls[config.TOGGLE_CALC_TYPE] ===
        config.CALC_TYPE_AMOUNT &&
        calc.amtPayment !== 0))
  );
};
