import NewSmovia from './smovia.js';
import './styles/smovia.css';
import './audio/SmoviaTheme.mp3';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

let audioOn = false;

const component = () => {
  const element = document.createElement('div');
  element.setAttribute("id", "new-smovia");
  return element;
};

const hud = () => {
	const hudElement = document.createElement('div');
	hudElement.setAttribute('id', 'smovia-console');
	return hudElement;
};

const charHud = () => {
	const hudElement = document.createElement('div');
	hudElement.setAttribute('id', 'character-console');
	return hudElement;
};

const setupAudio = () => {

	const audio = new Audio("./audio/SmoviaTheme.mp3");
	audio.addEventListener('ended', () => {
	    audio.currentTime = 0;
	    audio.play();
	    audioOn = true;
	}, false);
	audio.play();

	const audioEl = document.createElement('div');
	audioEl.setAttribute('id', 'audio');
	audioEl.style.top = '8px';
	audioEl.style.height = '80px';
	audioEl.style.width = '80px';
  audioEl.style.left = '8px';
  audioEl.style.position = 'absolute';
  audioEl.style.backgroundColor = 'rgba(0,0,0,.3)';

  const audioIcon = document.createElement('i');
  audioIcon.setAttribute('id', 'audio-icon');
  audioIcon.className = "fas fa-volume-up";
  audioIcon.style.color = "#fff";


  audioEl.onclick = function(){
  	console.log("Switch!");
  	if (!audioOn) {
  		audio.play();
  		audioOn = true;
  	} else {
			audio.pause();
			audioOn = false;
  	}
  };

  audioEl.appendChild(audioIcon);

  return audioEl;
	// return audio;
};

const setupBody = () => {
	document.body.style.width = '100%';
	document.body.style.height = '100%';
	document.body.style.margin = 0;
	document.body.style.margin = 0;

	document.body.appendChild(component());
	console.log("Added container...");

	document.body.appendChild(hud());
	console.log("added hud");

	document.body.appendChild(setupAudio());
	console.log("added audio");

	document.body.appendChild(charHud());
	console.log("added charHud");	
}

setupBody();

// run
NewSmovia();
console.log("NewSmovia() started");