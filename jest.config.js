export default {
    testEnvironment: 'node',
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    clearMocks: true,

    transform: {
        '^.+\\.js$': 'babel-jest',
    },

    transformIgnorePatterns: [
        '/node_modules/'
    ]
};