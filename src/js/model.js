export const state = {
  calculator: {
    loanAmount: 250000,
    loanInterest: 6.7,
    termYears: 30,
    termType: "fixed",
  },
  results: {
    display: 0,
  },
};

//result: 1676
const _calculate = function () {
  const loanAmt = state.calculator.loanAmount;
  const interest = state.calculator.loanInterest / 100 / 12;
  const numPayments = state.calculator.termYears * 12;
  const discountFactor =
    ((1 + interest) ** numPayments - 1) /
    (interest * (1 + interest) ** numPayments);

  const result = Math.round((loanAmt / discountFactor) * 100) / 100;

  console.log("Result: ", result);
  return result;
};

const createCalcInputObject = function (data) {
  return {
    loanAmount: +data.loan_amount,
    loanInterest: +data.interest_rate,
    termYears: `${+data.loan_term.split(",")[0]}`,
    termType: `${data.loan_term.split(",")[1]}`,
  };
};

export const calculateMortgage = async function (data) {
  this.state.calculator = createCalcInputObject(data);
  this.state.results = {
    display: _calculate(),
  };
};
