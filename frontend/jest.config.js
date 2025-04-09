const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    '^swiper/css$': '<rootDir>/src/__mocks__/styleMock.ts',  },
};

module.exports = createJestConfig(customJestConfig);
