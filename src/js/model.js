import { DEFAULT_CALC_TYPE } from "./config.js";

export const state = {
  calculator: {
    mnthLoanAmount: 250000,
    amtPayment: 1650,
    loanInterest: 6.7,
    termYears: 30,
    termType: "fixed",
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
  const loanAmt = state.calculator.mnthLoanAmount;
  const interest = state.calculator.loanInterest / 100 / 12;
  const numPayments = state.calculator.termYears * 12;
  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  const result = Math.round((loanAmt / discountFactor) * 100) / 100;
  console.log("result: ", result);
  return result;
};

/**
 *
 * @returns {Number} Result of calculation for loan amount
 */
const _calculateAmount = function () {
  const payment = state.calculator.amtPayment;
  const interest = state.calculator.loanInterest / 100 / 12;
  const numPayments = state.calculator.termYears * 12;
  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  const result = Math.round(payment * discountFactor * 100) / 100;
  console.log("result: ", result);
  return result;
};

const createCalculator = function (data) {
  console.log("createCalculator()", data);
  return {
    mnthLoanAmount: +data.mnth_loan_amount,
    amtPayment: +data.amt_payment,
    loanInterest: +data.interest_rate,
    termYears: `${+data.loan_term.split(",")[0]}`,
    termType: `${data.loan_term.split(",")[1]}`,
  };
};

export const calculateMortgage = async function (data) {
  this.state.calculator = createCalculator(data);
  this.state.results.monthly = _calculateMonthly();
  this.state.results.amount = _calculateAmount();
};
