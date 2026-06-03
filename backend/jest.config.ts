export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/test"],
    testMatch: [
        "**/*.spec.ts",       // unitários dentro do src
        "**/test/**/*.test.ts" // integração dentro de test
    ],
    clearMocks: true,
};