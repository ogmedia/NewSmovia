import moment from 'moment';

const logger = (msg) => {
	const hudMessage = document.createElement('div');
  hudMessage.innerHTML = msg;
  const curConsole = document.getElementById('smovia-console');
  curConsole.insertBefore(hudMessage, curConsole.childNodes[0]);
}

export default logger;