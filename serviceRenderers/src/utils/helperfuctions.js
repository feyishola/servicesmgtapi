const ratings = (
  timeliness = 0,
  communication = 0,
  valueForMoney = 0,
  customerService = 0,
  professionalism = 0
) => {
  timeliness = Math.min(timeliness, 5);
  communication = Math.min(communication, 5);
  valueForMoney = Math.min(valueForMoney, 5);
  customerService = Math.min(customerService, 5);
  professionalism = Math.min(professionalism, 5);

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
