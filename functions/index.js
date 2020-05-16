const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const geohash = require('ngeohash');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// detect movement via latitude.
exports.characterMoved = functions.database.ref("/characters/{characterId}/position")
	.onWrite((change, context) => {
		const { characterId } = context.params;
		const { before, after} = change;
		const original = after.val();
		const { lat, lon } = original;
		const ghash = geohash.encode(lat, lon, 4);
		console.log("Character moved!", characterId);
		console.log("our position:", original);
		console.log("our geohash: ", ghash);
		console.log("our bounding box?:", geohash.decode_bbox(ghash));
		console.log(`New lat/lon ${lat}/${lon}`);
		return true;
	})

// detect change in resources
exports.characterResourceChanged = functions.database.ref("/characters/{characterId}/resources")
	.onWrite((change, context) => {
		const { characterId } = context.params;
		const { before, after} = change;
		console.log("Character resources changed!", characterId);
		return true;
	})

// see if there are resources nearby
const checkForResources = () => {
	admin.firestore()
};

// see if there are people nearby
const checkForCharacters = () => {

};


  // const box = utils.boundingBoxCoordinates(area.center, area.radius);
  // console.log('our box:', box);
  // // construct the GeoPoints
  // const lesserGeopoint = new admin.firestore.GeoPoint(box.swCorner.latitude, box.swCorner.longitude);
  // const greaterGeopoint = new admin.firestore.GeoPoint(box.neCorner.latitude, box.neCorner.longitude);

  // // construct the Firestore query
  // let query = firestore.collection('userLocs').where('geolocation', '>', lesserGeopoint).where('geolocation', '<', greaterGeopoint);

  // // return a Promise that fulfills with the locations
  // return query.get()
  //   .then((snapshot) => {
  //     const allLocs = []; 



const boundingBoxCoordinates = (center, radius) => {
  //console.log('center',center);
  //console.log('radius', radius);
  const KM_PER_DEGREE_LATITUDE = 1;
  const latDegrees = radius / KM_PER_DEGREE_LATITUDE;
  //console.log('latDegrees',latDegrees);
  const latitudeNorth = Math.min(90, center.latitude + latDegrees);
  const latitudeSouth = Math.max(-90, center.latitude - latDegrees);
  //console.log('latitudeNorth',latitudeNorth);
  //console.log('latitudeSouth',latitudeSouth);
  // calculate longitude based on current latitude
  const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
  const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
  const longDegs = Math.max(longDegsNorth, longDegsSouth);
  //console.log('longDegsNorth',longDegsNorth);
  //console.log('longDegsSouth',longDegsSouth);
  //console.log('longDegs',longDegs);
  return {
    swCorner: { // bottom-left (SW corner)
      latitude: latitudeSouth,
      longitude: wrapLongitude(center.longitude - longDegs),
    },
    neCorner: { // top-right (NE corner)
      latitude: latitudeNorth,
      longitude: wrapLongitude(center.longitude + longDegs),
    },
  };
}