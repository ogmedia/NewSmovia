import { Map, List, fromJS, merge, mergeDeep } from "immutable";
import { GameStore, loadData } from "./data";

import logger from './logger';

import { 
  Scene,
  Raycaster,
  Vector2,
  PerspectiveCamera,
  WebGLRenderer,
  SpotLight
} from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {  
  createCharacterData,
  createContinentMesh,
  createWorld,
  createCharacterMesh,
  createResourceData,
  createResourceMesh,
} from "./functions";

import { WORLD_SIZE } from "./config"

const worldSquared = (WORLD_SIZE*WORLD_SIZE);

const raycaster = new Raycaster();
const mouse = new Vector2();

// create a character
const createCharacter = (_character, _scene) => {
    const mapChar = _character;
    const { x, y, z } = createCharacterData(mapChar.position || { lat: mapChar.lat, lon: mapChar.lon });
    const c = {...mapChar, x, y, z };
    c.mesh = createCharacterMesh();
    c.mesh.callback = () => { 
      document.getElementById('character-console').innerHTML = `${c.first_name} ${c.last_name}`;
    };
    return c;
};

// create a resource
const createResource = (_resource, _scene) => {
    const mapRes = _resource;
    const { x, y, z } = createResourceData(mapRes.position);
    const c = {...mapRes, x, y, z };
    c.mesh = createResourceMesh();
    c.mesh.callback = () => { console.log("clicked on a resource") };
    return c;
};

const scene = new Scene();
const start =  () => {
	console.log("START!");
  GameStore.setup()

  const onDocumentMouseDown = event => {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children ); 
    if ( intersects.length > 0 ) {
        intersects[0].object.callback();
    }
  }
  window.addEventListener('click', onDocumentMouseDown, false);

  let container = document.getElementById('new-smovia');

	var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new WebGLRenderer({
		container,
		alpha: true,
	});

	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);

	var theWorld = createWorld();
  theWorld.callback = () => { console.log("clicked on the world") };
	scene.add( theWorld );

	camera.position.z = 1.2;
  camera.position.x = 1.2;	

	var spotLight = new SpotLight(0xffffff, 1.5);
	spotLight.position.set( 800, 10, 800 );

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;

	scene.add( spotLight );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

	function animate() {
		requestAnimationFrame( animate );
    theWorld.rotation.y += .0002;
    gameLoop();
		controls.update();
		renderer.render( scene, camera );
	}

	console.log("Start animate");
	animate();
}

const gameLoop = () => {
    // render characters
    const nC = checkCharMesh();
    const mM = moveMeshes();
    GameStore.CharactersState = mergeDeep(nC, mM);

    // render resources
    const nR = checkResourceMesh();
    const mR = moveResources();
    GameStore.ResourcesState = mergeDeep(nR, mR);
};

const checkCharMesh = () => {
  const missingMeshes = GameStore.CharactersState.filter(c => {
    return (!c.mesh);
  });
  // console.log("found missing characters", missingMeshes.size);
  return missingMeshes.map(c => {
    const newChar = createCharacter(c,scene);
    newChar.mesh.position.set(newChar.x, newChar.y, newChar.z);
    scene.add(newChar.mesh);
    logger(`${c.first_name} ${c.last_name} has been created.`);

    return newChar;
  });
};

const checkResourceMesh = () => {
  const missingMeshes = GameStore.ResourcesState.filter(c => {
    return (!c.mesh);
  });
  return missingMeshes.map(c => {
    const newRes = createResource(c, scene);
    newRes.mesh.position.set(newRes.x, newRes.y, newRes.z);
    scene.add(newRes.mesh);
    logger(`Resource: ${c.id} has been created.`);

    return newRes;
  });
};

const moveMeshes = () => {
  const meshesToMove = GameStore.CharactersState.filter(c => {
    return (!c.mesh === false)
  });

  return meshesToMove.map(c => {
    if (c.mesh) {
      // console.log("has a mesh!", c.mesh);
      const { x, y, z } = createCharacterData(c.position || { lat: c.lat, lon: c.lon });
      // if our supposed position is not accurate and not moving
      if (
        (
          c.mesh.position.x !== x ||
          c.mesh.position.y !== y ||
          c.mesh.position.z !== z 
        ) &&
        c.moving !== true
      ){
          // console.log(c.id + ' isnt moving');
          c.moving = true;
          GameStore.CharactersState =  GameStore.CharactersState.set(c.id,c);
          moveCharacter(c, { x, y, z });
      } else {
        // console.log("already moving...",c.moving);
      }

    } else {
        console.log("does NOT have a mesh");
    }
    return c;
  });
};

const moveResources = () => {
  const meshesToMove = GameStore.ResourcesState.filter(c => {
    return (!c.mesh === false)
  });

  return meshesToMove.map(c => {
    if (c.mesh) {
      // console.log("has a mesh!", c.mesh);
      const { x, y, z } = createResourceData(c.position);
      if (
        c.mesh.position.x !== x ||
        c.mesh.position.y !== y ||
        c.mesh.position.z !== z
      ){
        c.mesh.position.set(x, y, z);
        logger(`resource has moved.`);
      }

      c.mesh.rotation.y += .01;
      c.mesh.rotation.x += .01;
    } else {
        console.log("resource does NOT have a mesh");
    }
    return c;
  });
};

const moveCharacter = (_character, { x, y, z}) => {
  const { position } = _character.mesh;
  let increment = {
    x: (x - position.x) / 40,
    y: (y - position.y) / 40,
    z: (z - position.z) / 40,
  };
  logger(`${_character.first_name} ${_character.last_name} is moving`);
  const moving = setInterval(() => {
    if (
      (Math.round(position.x * 1000) / 1000 === Math.round(x * 1000) / 1000) ||
      (Math.round(position.y * 1000) / 1000 === Math.round(y * 1000) / 1000) ||
      (Math.round(position.z * 1000) / 1000 === Math.round(z * 1000) / 1000)
    ){
      // logger(`${_character.first_name} ${_character.last_name} finished moving`);
      _character.mesh.position.set(x, y, z);
      clearInterval(moving);
      _character.moving = false;
      GameStore.CharactersState =  GameStore.CharactersState.set(_character.id, _character);

    } else {

      const newX = position.x += increment.x;
      const newY = position.y += increment.y;
      const newZ = position.z += increment.z;

      // console.log(`${_character.first_name} ${_character.last_name} has moved to ${newX} ${newY} ${newZ}`);
      // console.log(`target is ${x} ${y} ${z}`)
      _character.mesh.position.set(newX, newY, newZ);
      _character.mesh.rotation.y += .2;
      _character.mesh.rotation.x += .2;
    }

  }, 100);

  return moving;
};

export default start;
