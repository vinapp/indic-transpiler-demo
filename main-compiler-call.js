import { compiler, interpreter } from './src/compiler';

export function transpileCode(clickElement, outputElement, codeElement, convertedCodeElement) {
  const getTranspiledOutput = () => {
    if (codeElement.value !== "") {
      const output = compiler(codeElement.value);
      const interpretedoutput = interpreter(output);
      convertedCodeElement.value = output
      // outputElement.innerHTML = output
    } else {
      // outputElement.innerHTML = "output language"
    }
    clickElement.innerHTML = "compile/run"
  }
  clickElement.addEventListener('click', () => getTranspiledOutput())
  getTranspiledOutput()
}