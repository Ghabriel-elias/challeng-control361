module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', 
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', 
    '\\.(css|less|scss|sass)$': '<rootDir>/__tests__/styleMock.ts',
  },
};