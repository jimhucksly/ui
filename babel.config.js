module.exports = {
  "env": {
    "test": {
      "presets": ["@babel/preset-env", '@babel/preset-typescript'],
      "plugins": [
        "const-enum",
        ["@babel/plugin-transform-typescript", { allowDeclareFields: true }],
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-transform-class-properties",
        "@babel/plugin-transform-private-methods",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-transform-export-namespace-from"
      ]
    }
  }
}
