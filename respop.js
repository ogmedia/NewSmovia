const firebase = require("firebase/app");
require("firebase/firestore");

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

populateResources = () => {

	const longitude = Math.random() * 180;
	const latitude = Math.random() * 90;
	const amount = Math.ceil(Math.random() * 5);
	const position = new firebase.firestore.GeoPoint(latitude, longitude );
	const created = new firebase.firestore.Timestamp();

	return firebase.firestore().collection("resources").add({ amount, position, created })
};

setInterval(populateResources, 2000);	

