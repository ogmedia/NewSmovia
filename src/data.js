import firebase from "firebase/app";
import "firebase/database"
import "firebase/firestore"

import { Map, List, fromJS, merge, mergeDeep } from "immutable";

const firebaseConfig = {
  apiKey: "AIzaSyBmVCT-EW-O8WwXRjxtoCHbuFI_AQxWIJ0",
  authDomain: "smovia-12e5a.firebaseapp.com",
  databaseURL: "https://smovia-12e5a.firebaseio.com",
  projectId: "smovia-12e5a",
  storageBucket: "smovia-12e5a.appspot.com",
  messagingSenderId: "531785474727",
  appId: "1:531785474727:web:992557aa319ca6cc62b182"
};

firebase.initializeApp(firebaseConfig);

const SmoviaData = {};
const SmoviaCharacterDataRef = firebase.database().ref("characters");
const ResourcesDataRef = firebase.firestore().collection("resources");

const GameStore = {
	CharactersState: Map(),
	ResourcesState: Map(),
};

const setCharacterStateFromSnap = characterSnap => {
	const character = characterSnap.val();
	const key = characterSnap.key;
	if (character) {
		GameStore.CharactersState = mergeDeep(
			GameStore.CharactersState, 
			GameStore.CharactersState.set(key, character)
		);
	}
	return true;
}

const bindToDB = () => {
	SmoviaCharacterDataRef.on("child_changed",
		setCharacterStateFromSnap,
		e => {
		console.log("ERROR:", e);
	})
	loadCharacters();
	loadResources();
};


GameStore.setup = bindToDB;

const loadCharacters = () => {
	SmoviaCharacterDataRef.once("value")
		.then(charsSnap => {
			const charsVal = charsSnap.val();
			GameStore.CharactersState = mergeDeep(GameStore.CharactersState, charsVal);
		})
};

const loadResources = () => {
	ResourcesDataRef.get()
		.then(resSnap => {
			const allRes = {};
			resSnap.forEach(r => {
				const res = r.data();
				res.id = r.id;
				allRes[res.id] = res;
			});
			console.log("Resources", allRes);
			GameStore.ResourcesState = mergeDeep(GameStore.ResourcesState, allRes);
		})
};

const loadData = () => {
	console.log("Loading data...");
	const MainDataKeys = Object.keys(SmoviaData);
	console.log(MainDataKeys);

	const getData = (key) => {
		return SmoviaData[key];
	}

	const dataHolder = {};
	MainDataKeys.forEach(k => {
		dataHolder[k] = getData(k);
	});

	console.log(dataHolder);

	const worldContinents = wId => {
		return Object.keys(dataHolder.continents)
			.map(ck => {
				dataHolder.continents[ck].continent_id = ck;
				return dataHolder.continents[ck]
			})
			.filter(c => c.world_id === wId);
	};

	const continentCountries = cId => {
		return Object.keys(dataHolder.countries)
			.map(ck => dataHolder.countries[ck])
			.filter(c => c.continent_id === cId);
	}

	const continentKingdoms = cId => {
		return Object.keys(dataHolder.kingdoms)
			.map(ck => dataHolder.kingdoms[ck])
			.filter(c => c.continent_id === cId);
	}

	const getLineages = (characters, continent) => {
		const allCharIds = Object.keys(characters);
		
		const getChildren = p => {
			return allCharIds.filter(c => {
			  return (characters[c].parent_id === p);
		  })
		  .map(c => characters[c]);
		};

		const contParents = allCharIds.filter(c => {
			// console.log("parent id:", characters[c].parent_id);
			const pId = characters[c].parent_id;
			return (allCharIds.indexOf(pId) < 0 && characters[c].continent === continent);
		}).map(pId => {
			return {
				...characters[pId],
				children: getChildren(pId)
			}
		});


		return contParents;
	};


	const worlds = Object.keys(dataHolder.worlds || {}).map(wId => {
		return { ...dataHolder.worlds[wId],world_id: wId, continents: worldContinents(wId) };
	})
	// console.log(worlds);

	const worldsContinentsWithCountriesAndKingdoms = worlds.map(w => {
		return {
			...w,
			continents: w.continents.map(c => {
			  return {
				  ...c,
				  kingdoms: continentKingdoms(c.continent_id),
				  countries: continentCountries(c.continent_id),
					families: getLineages(dataHolder.characters, c.continent_id)
			  }
			}),
		};
	})
	
	return {
		worldsState: worldsContinentsWithCountriesAndKingdoms,
		charactersState: dataHolder.characters, 
	}
};

export { GameStore, loadData };