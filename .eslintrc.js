module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
  ],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  plugins: ['flowtype'],
};
