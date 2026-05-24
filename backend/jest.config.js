export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: [
        "**/*.spec.ts",       // unitários dentro do src
        "**/tests/**/*.test.ts" // integração dentro de tests
    ],
    clearMocks: true,
};