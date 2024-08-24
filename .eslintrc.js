{
    "env": {
      "node": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module"
    },
    "rules": {
      "no-console": "warn",
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
  