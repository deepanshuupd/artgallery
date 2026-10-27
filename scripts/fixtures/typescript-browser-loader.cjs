const ts = require('typescript');
module.exports = function transform(source) {
  return ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022,
  }, fileName: this.resourcePath }).outputText;
};
