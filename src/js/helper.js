/**
 * Formats the input amount as currency
 * @param {Number} amount currency amount
 * @param {String} locale string of local, such as 'en-US'
 * @param {String} currency string of currency type, such as 'USD'
 * @returns
 */
export const formatCurrency = function (amount, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const roundMoney = function (amount) {
  return Math.round(amount * 100) / 100;
};
