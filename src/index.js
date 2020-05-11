import NewSmovia from './smovia.js';
import './styles/smovia.css';

function component() {
  const element = document.createElement('div');
  element.setAttribute("id", "new-smovia");
  // element.style.width = '60em';
  // element.style.height = '50em';
  // element.style.backgroundColor = 'black';
  return element;
}

document.body.appendChild(component());
console.log("Added container...");
NewSmovia();