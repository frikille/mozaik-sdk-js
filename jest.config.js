module.exports = {
  testMatch: ['<rootDir>/**/?(*.)(test).js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: ['src/**/*.{js}'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
