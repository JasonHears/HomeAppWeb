import {
  DEFAULT_CALC_TYPE,
  CALC_TYPE_MONTHLY,
  CALC_TYPE_AMOUNT,
} from "./config.js";

export const state = {
  calculator: {
    monthly: {
      loanAmount: 250000,
      loanInterest: 6.7,
      termYears: 30,
      termType: "fixed",
    },
    amount: {
      payment: 1650,
      loanInterest: 6.7,
      termYears: 30,
      termType: "fixed",
    },
  },
  controls: {
    calculationType: DEFAULT_CALC_TYPE,
  },
  results: {
    monthly: 0,
    amount: 0,
  },
  user: {
    locale: "en-US",
    currency: "USD",
  },
};

//result: 1676
const _calculateMonthly = function () {
  const loanAmt = state.calculator.monthly.loanAmount;
  const interest = state.calculator.monthly.loanInterest / 100 / 12;
  const numPayments = state.calculator.monthly.termYears * 12;
  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  const result = Math.round((loanAmt / discountFactor) * 100) / 100;

  console.log("Monthly Result: ", result);
  return result;
};

const _calculateAmount = function () {
  const payment = state.calculator.amount.payment;
  const interest = state.calculator.amount.loanInterest / 100 / 12;
  const numPayments = state.calculator.amount.termYears * 12;
  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  const result = Math.round(payment * discountFactor * 100) / 100;

  console.log("Amount Result: ", result);
  return result;
};

const createMonthlyCalculator = function (data) {
  return {
    loanAmount: +data.mnth_loan_amount,
    loanInterest: +data.mnth_interest_rate,
    termYears: `${+data.mnth_loan_term.split(",")[0]}`,
    termType: `${data.mnth_loan_term.split(",")[1]}`,
  };
};

const createAmountCalculator = function (data) {
  return {
    payment: +data.amt_payment,
    loanInterest: +data.amt_interest_rate,
    termYears: `${+data.amt_loan_term.split(",")[0]}`,
    termType: `${data.amt_loan_term.split(",")[1]}`,
  };
};

export const calculateMortgage = async function (data) {
  if (this.state.controls.calculationType == CALC_TYPE_MONTHLY) {
    this.state.calculator.monthly = createMonthlyCalculator(data);
    this.state.results.monthly = _calculateMonthly();
  }

  if (this.state.controls.calculationType == CALC_TYPE_AMOUNT) {
    this.state.calculator.amount = createAmountCalculator(data);
    this.state.results.amount = _calculateAmount();
  }
};
