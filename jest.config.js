/** @type {import('ts-jest').JestConfigWithTsJest} **/

const { createJsWithTsPreset } = require('ts-jest');

const presetConfig = createJsWithTsPreset();

module.exports = {
  ...presetConfig,
  testEnvironment: "node",
  transformIgnorePatterns: ['node_modules/(?!uuid)'],
};
