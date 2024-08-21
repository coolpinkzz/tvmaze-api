module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
    testMatch: ['**/?(*.)+(spec|test).ts'], // Look for test files with .ts extension
};
