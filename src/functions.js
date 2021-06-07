import { WORLD_SIZE } from "./config";
import { 
  Mesh,
  SphereBufferGeometry,
  MeshPhongMaterial,
  BoxGeometry,
  MeshPhysicalMaterial,
}  from "three";

const createCharacterData = ({ lat, lon }) => {
  let x = Math.cos(lon) * Math.cos(lat) * WORLD_SIZE;
  let y = Math.cos(lon) * Math.sin(lat) * WORLD_SIZE;
  let z = Math.sin(lon) * WORLD_SIZE;
  return { x, y, z };
};

const createCharacterMesh = () => {
  let colors = [ 0x00FF00, 0x0000FF ];
  //(Math.random()*0xFFFFFF<<0)
  const ng = new SphereBufferGeometry(.02, 6, 6);
  const nm = new MeshPhongMaterial({ color: (Math.random() * 0xFFFFFF<<0), wireframe: true });
  return new Mesh(ng, nm); 
};

const createResourceData = ({ latitude, longitude }) => {
  let x = Math.cos(longitude) * Math.cos(latitude) * WORLD_SIZE;
  let y = Math.cos(longitude) * Math.sin(latitude) * WORLD_SIZE;
  let z = Math.sin(longitude) * WORLD_SIZE;
  return { x, y, z };
};

const createResourceMesh = () => {
  let colors = [ 0x00FF00, 0x0000FF ];
  //(Math.random()*0xFFFFFF<<0)

  const ng = new BoxGeometry(.01, .01, .01);
  const nm = new MeshPhysicalMaterial({ metalness: .7, color:  0xFFFFFF, reflectivity: .9, roughness: .3 });
  return new Mesh(ng, nm); 
};

const createContinentMesh = ({ width, height }) => {
  const ng = new BoxGeometry(width, height, .3);
  const nm = new MeshPhongMaterial({ color: 0x005500, wireframe: true });
  return new Mesh(ng, nm);
}

const createWorld = () => {
  const geometry = new SphereBufferGeometry(WORLD_SIZE, 10, 10);
  const material = new MeshPhongMaterial({ color: 0x22889C, wireframe: true });
  return new Mesh( geometry, material );
};

export { 
	createCharacterData,
  createResourceData,
	createContinentMesh,
	createWorld,
	createCharacterMesh,
  createResourceMesh
};
