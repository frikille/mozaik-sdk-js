// @flow
module.exports = function hrTimeToMillis(hrTime?: [number, number]): number {
  if (!hrTime) {
    return 0;
  }
  const ms = parseInt(hrTime[1], 10) / 1000000;
  return parseFloat(parseFloat(parseInt(hrTime[0], 10) * 1000 + ms).toFixed(2));
};
