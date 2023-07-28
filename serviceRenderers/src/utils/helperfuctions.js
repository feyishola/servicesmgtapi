const ratings = (
  timeliness = 0,
  communication = 0,
  valueForMoney = 0,
  customerService = 0,
  professionalism = 0
) => {
  let value =
    (timeliness +
      communication +
      valueForMoney +
      customerService +
      professionalism) /
    5;

  return value;
};

module.exports = ratings;
