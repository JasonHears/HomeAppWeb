import * as config from "./config.js";
import { roundMoney } from "./helper.js";

export const state = {
  calculator: {
    mnthLoanAmount: 0,
    amtPayment: 0,
    loanInterest: 0,
    termYears: 0,
    termType: "",
    propertyTax: 0,
    insurance: 0,
    downPayment: 0,
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
 * Calculates the monthly PMI payment cost based on loan amount and down payment
 * @param {Number} loanAmt amount being financed via loan
 * @param {Number} downPayment amount provided for down payment
 * @returns
 */
const _calculateMonthlyPMI = function (loanAmt, downPayment) {
  // loanAmt + downPayment = purchase price
  const percentFunded = (downPayment / (loanAmt + downPayment)) * 100;

  if (percentFunded >= config.PMI_QUALIFY_PCT) return 0;

  // calculate 0-1 scale for determining how much PMI percentage rate will be
  const pctPMI =
    (config.PMI_QUALIFY_PCT - percentFunded) / config.PMI_QUALIFY_PCT;
  // use above percentage to determine actual PMI percentage rate
  const pmiRate = (config.PMI_MAXIMUM * pctPMI + config.PMI_MINIMUM) / 100;

  // return monthly PMI cost
  return (loanAmt * pmiRate) / 12;
};

/**
 * Calculates the total PMI cost over the life of a loan
 * @param {Number} loanAmt amount being financed via loan
 * @param {Number} downPayment amount provided for down payment
 * @param {Number} termYears number of years loan is financed for
 * @returns
 */
const _calculateAmountPMI = function (loanAmt, downPayment, termYears) {
  // 20% of loan is paid off after x months of loan (assumes straight-line)
  // assuming PMI is removed after 20% ltv
  const pmiTermMonths = termYears * 12 * 0.2; // 20% of total months of loan

  // calculate the monthly PMI cost
  const monthlyPMI = _calculateMonthlyPMI(loanAmt, downPayment);

  // calculate the total PMI cost over the loan (assumes PMI removed after 20% ltv)
  const totalPMICost = monthlyPMI * pmiTermMonths;

  // return total PMI cost of loan
  return totalPMICost;
};

/**
 * Calculates the monthly payment based on loan amount
 * @returns {Number} Result of calculation for monthly payment
 */
const _calculateMonthly = function () {
  const calc = state.calculator;
  const interest = calc.loanInterest / 100 / 12;
  const numPayments = calc.termYears * 12;

  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  let result = roundMoney(calc.mnthLoanAmount / discountFactor);

  // Property Tax Inclusion
  if (state.controls?.[config.TOGGLE_PROPERTY_TAX] && calc.propertyTax !== 0) {
    result += calc.propertyTax / 12;
  }

  // Property Insurance Inclusion
  if (state.controls?.[config.TOGGLE_INSURANCE] && calc.insurance !== 0) {
    result += calc.insurance / 12;
  }

  // PMI Inclusion
  if (state.controls?.[config.TOGGLE_PMI] && calc.downPayment !== 0) {
    const monthlyPMI = _calculateMonthlyPMI(
      calc.mnthLoanAmount,
      calc.downPayment
    );
    result += monthlyPMI;
  }

  console.log("result mnth: ", result);
  return result;
};

/**
 * Calculates the maximum loan amount based on monthly payment
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

  let result = roundMoney(adjustedPayment * discountFactor); // current loan amount

  // PMI Inclusion
  if (state.controls?.[config.TOGGLE_PMI] && calc.downPayment !== 0) {
    const totalPMICost = _calculateAmountPMI(
      result,
      calc.downPayment,
      calc.termYears
    );
    result -= totalPMICost;
  }

  console.log("result amt: ", result);
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
      downPayment: +data.pmi,
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
