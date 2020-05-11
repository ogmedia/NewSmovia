import _ from "lodash";
import { Map, List, fromJS } from "immutable";
import { loadData } from "./data";

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const wD = loadData();

const worldsState = fromJS(wD.worldsState);
const charactersState = fromJS(wD.charactersState);

console.log(worldsState);
console.log(charactersState);

const wState = worldsState.get(0);
const WORLD_SIZE = 1;

const createWorld = () => {};
const createContinents = _scene => {
	const conts = wState.get("continents");
	const numberOfConts = conts.size;
	console.log("number of continents", numberOfConts);
  // chop top of sphere y >= .15 ; 3
  // chop middle -.15 < y < .15  ; 5
  // chop bottom of sphere y <= -.15 ; 2
  
  // top routine up to 3
  // size limit each build = available - build width
  // available width is 1/3 of total
  // available height is .3
  const topRoutine = _available => {
  	const width = (_available / 3) * Math.random();
  	const height = .2;
  	return {width, height, yOffset: .45 };
  };

  // middle routine up to 5
  // size limit each build = available - buildwidth
  // available is 1/5 of total
  // available height is .3
  const middleRoutine = _available => {
  	const width = (_available / 5) * Math.random();
  	const height = .2;
  	return {height, width, yOffset: 0 };
  }
  // 
  // bottom routine up to 2
  // size limit eadch build = available - build width
  // available is 1/2 of total
  // available height is .3
  const bottomRoutine = _available => {
  	const width = (_available / 2) * Math.random();
  	const height = .2;
  	return {height, width, yOffset: -.4 };
  }

  const mapToPosition = ({ xOffset, yOffset }, _available) => {
  	console.log("Submitted offsets");
  	console.log(xOffset);
  	console.log(yOffset);
  	console.log("available space", _available);
  	// z2 = r2 - x2 - y2
  	const worldSquared = (WORLD_SIZE*WORLD_SIZE);
  	console.log("World squared:", worldSquared);
  	const xSquared = (xOffset * xOffset);
  	console.log("xSquared", xSquared);
  	const ySquared = (yOffset * yOffset);
  	console.log("ySquared:", ySquared);
  	let zSqr = worldSquared - xSquared - ySquared;
  	console.log('zSqr', zSqr);
  	let zCoord = Math.sqrt(zSqr); //multiply negative?
  	if (xOffset > Math.PI/2) {
  		zCoord = -zCoord;
  	}
  	return { xOffset, yOffset, zCoord };
  }

  let stage = "top";
  let available = Math.PI*.4;
  let offsetTrack = 0;
  const contMeshes = conts.map((c,i) => {

  	if (i > 7 && stage !== "bottom") {
  		stage = "bottom";
  		available = Math.PI*.4;
  		offsetTrack = 0;
  	}
  	if (i > 2 && stage !== "middle" && i <= 7 ) {
  		stage = "middle";
  		available = Math.PI;
  		offsetTrack = 0;
  	}
  	let mDetail = null;
  	console.log("Starting Stage", stage);
  	switch (stage) {
  		case "middle":
				mDetail = middleRoutine(available);
  			break;
  		case "bottom":
				mDetail = bottomRoutine(available);
  			break;
  		case "top":
  			mDetail = topRoutine(available);
  			break;
  	}
  	mDetail.xOffset = offsetTrack;
		// console.log('available', available);
		// console.log(mDetail);
  	// console.log("continent in state", c.toObject());
  	const ng = new THREE.BoxGeometry(mDetail.width,.08,mDetail.height);
  	const nm = new THREE.MeshPhongMaterial({ color: 0x005500});

  	const contMesh = new THREE.Mesh(ng, nm);
  	let { xOffset, yOffset, zCoord } = mapToPosition(mDetail, available);
  	console.log('xOffset', xOffset);
  	console.log('yOffset', yOffset);
  	console.log('zCoord', zCoord);
  	const quat = new THREE.Quaternion();// new THREE.Quaternion(xOffset, yOffset, zCoord, 1);
  // 	contMesh.applyQuaternion(quat);
  // 	contMesh.quaternion.normalize();
    contMesh.rotateX(90*Math.PI/180);//(xOffset);
    // contMesh.rotateY(yOffset);
  	contMesh.position.set(xOffset, yOffset, zCoord);
  	offsetTrack += mDetail.width;
    return contMesh;
  });

  contMeshes.forEach((m,i) => {
  	// m.position.y = (.3*i);
  	_scene.add(m);
  });
};

const start =  () => {
	console.log("START!");
  let container = document.getElementById('new-smovia');

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer({
		container,
		alpha: true,
	});

	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);

	var geometry = new THREE.SphereBufferGeometry(WORLD_SIZE, 24, 24);
	var material = new THREE.MeshPhongMaterial({ color: 0x117799 });
	var sphere = new THREE.Mesh( geometry, material );
	scene.add( sphere );

	camera.position.z = 2;	

	var spotLight = new THREE.SpotLight(0xffffff, 1.5);
	spotLight.position.set( 500, 50, 500 );

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;

	scene.add( spotLight );

	createContinents(scene);

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

	function animate() {
		requestAnimationFrame( animate );
		// sphere.rotation.y += 0.005;
		
		controls.update();
		renderer.render( scene, camera );
	}

	console.log("World state", wState.toObject());
	console.log("Start animate");
	animate();
}
export default start;