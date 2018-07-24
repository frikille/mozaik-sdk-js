// @flow
module.exports = function generateLabel(name: string): string {
  const label = name
    .replace(/_/g, ' ')
    .replace(
      /([a-zA-Z])([A-Z])([a-z])/g,
      g => `${g[0]} ${g[1].toLowerCase()}${g[2]}`
    )
    .replace(/([a-z])([A-Z])/g, g => `${g[0]} ${g[1]}`)
    .replace(/([a-zA-Z])([0-9])/g, g => `${g[0]} ${g[1]}`);

  return label.charAt(0).toUpperCase() + label.slice(1);
};
