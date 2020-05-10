import _ from 'lodash';

import SmoviaData from '../smovia-12e5a-export.json';

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

export { loadData };