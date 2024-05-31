module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
    '^.+\\.jsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
    '^.+\\.bin$': ['<rootDir>config/rawLoader.cjs'],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^node-kms$': '<rootDir>/src/kms/node',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    'src/**/*.tsx',
    '!src/**/*.story.**',
  ],
  testRegex: '\\.test\\.tsx?$',
  coverageReporters: ['lcov', 'text-summary', 'json'],
  transformIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
