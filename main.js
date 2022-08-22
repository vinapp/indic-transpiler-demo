// import './style.css'
// import javascriptLogo from './javascript.svg'
import { transpileCode } from './main-compiler-call.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Transpiler - Indic Languages</h1>
    <div class="card">
      <textarea id="code" style="height: 189px; width: 289px;"></textarea>
      <textarea id="convertedcode" style="height: 189px; width: 289px;"></textarea>
    </div>
    <div class="card">
      <button id="compile" type="button"></button>
    </div>
    <div class="card">
      <p id="emitter"></p>
    </div>
  </div>
`

transpileCode(document.querySelector('#compile'), 
              document.querySelector('#emitter'),
              document.querySelector('#code'),
              document.querySelector('#convertedcode'))