module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^.+\\.(css)$': '<rootDir>/config/css-stub.ts',
  },
}
