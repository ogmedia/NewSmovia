const firebase = require("firebase/app");
require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyBmVCT-EW-O8WwXRjxtoCHbuFI_AQxWIJ0",
  authDomain: "smovia-12e5a.firebaseapp.com",
  databaseURL: "https://smovia-12e5a.firebaseio.com",
  projectId: "smovia-12e5a",
  storageBucket: "smovia-12e5a.appspot.com",
  messagingSenderId: "531785474727",
  appId: "1:531785474727:web:992557aa319ca6cc62b182"
};

var defaultProject = firebase.initializeApp(firebaseConfig);
console.log("done", defaultProject.name);

const geohash = require('ngeohash');

const getRandomCharacter = () => {
	return firebase
		.database()
		.ref("characters")
		.once("value")
		.then(s => {
			const numChars = s.numChildren();
			const randIndex = Math.round(Math.random() * numChars);
			console.log("random index", randIndex);
			console.log("Total characters", numChars);
			const characters = s.val();
			const characterKeys = Object.keys(characters);
			//console.log("char keys", characterKeys);
			const randomCharacterKey = characterKeys[randIndex];
			console.log("random Character key", randomCharacterKey);
			const charToUpdate = characters[randomCharacterKey];
			console.log("Char to update", charToUpdate);
			return charToUpdate;
		});
}

const randomMovementAmount = () => {
	//plus or minus
	const rand = Math.round(Math.random());
	let xMove = Math.random()*.25;
	if (rand === 1) {
		xMove = 0 - xMove;
	}
	let yMove = Math.random()*.25;
	if (rand === 0) {
		yMove = 0 - yMove;
	}
	return { xMove, yMove };
}

const moveCharacter = randChar => {
		// console.log("move this character!", randChar);
		const movement = randomMovementAmount();
		console.log("rand movement", movement);

		const characterRef = firebase.database().ref("characters/" + randChar.id);
		let newLat = parseFloat(randChar.lat || 0) + movement.xMove;
		let newLon = parseFloat(randChar.lon || 0) + movement.yMove;
		if( newLat > 90){
			newLat = 90;
		}
		if( newLat < -90){
			newLat = -90;
		}
		if( newLon > 180){
			newLong = 180;
		}
		if( newLon < -180){
			newLon = -180;
		}
		console.log("new lat", newLat);
		console.log("new lon",newLon);
		const ghash = geohash.encode( Math.round(newLat * 1e4) / 1e4, Math.round(newLon * 1e4) / 1e4 );
		console.log("created a geohash!", ghash);
		return Promise.all([
			characterRef.child("position").update({
				lat: Math.round(newLat * 1e4) / 1e4,
				lon: Math.round(newLon * 1e4) / 1e4
			}),
			characterRef.child("geohash").set(ghash)
		]);
}


setInterval(() => {
	console.log("move a character!");
	getRandomCharacter()
		.then(moveCharacter)
		.catch(e => {
			console.log("ERROR", e);
		});

}, 2000);

setInterval(() => {
	console.log("move a character!");
	getRandomCharacter()
		.then(moveCharacter)
		.catch(e => {
			console.log("ERROR", e);
		});

}, 4000);