/**
 * Calculate delivery fee based on distance
 * Base fee: 30 units, Additional: 5 units per km
 */
const calculateDeliveryFee = (distance) => {
  const baseFee = 30;
  const perKmFee = 5;
  return baseFee + (Math.ceil(distance) * perKmFee);
};

module.exports = calculateDeliveryFee;
