module.exports = {
    "setupFiles": [
        "<rootDir>/testSetUp.js"
      ],
    "collectCoverage": true,
    "testPathIgnorePatterns": [
        "node_modules"
    ],
    "coverageDirectory": "./reports/unit/jest",
    "moduleFileExtensions": [
        "js"
    ],
    "moduleNameMapper": {
        "^.+\\.(scss|png)$": "<rootDir>/style-mock.js"
      },
    "transform": {".*": "<rootDir>/node_modules/babel-jest"} 
};