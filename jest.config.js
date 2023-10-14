module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/server/**/*.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
