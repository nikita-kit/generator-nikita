module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:promise/recommended"
    ],
    "plugins": [
        "import",
        "promise"
    ],
    "env": {
        "browser": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "curly": ["error", "all"],
        "dot-notation": "error",
        "no-eval": "error",
        "no-implicit-globals": "error",
        "no-console": "warn",
        "arrow-body-style": ["error", "always"],
        "import/no-unresolved": "off",
        "import/unambiguous": "off",
    }
};