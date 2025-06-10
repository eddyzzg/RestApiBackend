export default {
    testEnvironment: 'node',
    testMatch: [
        "**/tests/**/*.test.js" // Testy w folderze tests/ z rozszerzeniem .test.js
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!your-es-module-that-needs-transforming)'
    ],
    clearMocks: true,
};