import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// Constantes
const SKY_COLOR = 0x11AAee;
const GRASS_COLOR = 0x33AA33;
const ANCHO_CASTILLO = 3;

// Rendering
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(SKY_COLOR);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

// Luces
const hemisphereLight = new THREE.HemisphereLight(SKY_COLOR, GRASS_COLOR);
hemisphereLight.position.y = 3;
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight);
const sunLight = new THREE.DirectionalLight();
sunLight.lookAt(0, 0, 0);
const sunLightHelper = new THREE.DirectionalLightHelper(sunLight);
scene.add(hemisphereLight);
//scene.add(hemisphereLightHelper);
scene.add(sunLight);
//scene.add(sunLightHelper);

// Helpers adicionales
const axesHelper = new THREE.AxesHelper();
const gridHelper = new THREE.GridHelper();
//scene.add(axesHelper);
//scene.add(gridHelper);

// Isla
const islandGeometry = new THREE.CylinderGeometry(10, 8, 3, 100);
const islandMaterial = new THREE.MeshPhongMaterial({ color: 0x22AA22 });
const island = new THREE.Mesh(islandGeometry, islandMaterial);
scene.add(island);

// Castillo
const castle = new THREE.Object3D();

const baseCastleGeometry = new THREE.BoxGeometry(ANCHO_CASTILLO, ANCHO_CASTILLO, ANCHO_CASTILLO);
const baseCastleMaterial = new THREE.MeshPhongMaterial({ color: 0x778899 });
const baseCastle = new THREE.Mesh(baseCastleGeometry, baseCastleMaterial);
castle.add(baseCastle);

const baseTowerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4);
const topTowerGeometry = new THREE.ConeGeometry(0.75, 1.75);
const topTowerMaterial = new THREE.MeshPhongMaterial({ color: 0xAA5522 });
[{ x: -1, z: -1 }, { x: 1, z: -1 }, { x: 1, z: 1 }, { x: -1, z: 1 }].forEach(pos => {
  const tower = new THREE.Object3D();

  const baseTower = new THREE.Mesh(baseTowerGeometry, baseCastleMaterial);
  tower.add(baseTower);

  const topTower = new THREE.Mesh(topTowerGeometry, topTowerMaterial);
  topTower.position.y = 2.5;
  tower.add(topTower);

  tower.position.x = pos.x * ANCHO_CASTILLO / 2;
  tower.position.z = pos.z * ANCHO_CASTILLO / 2;
  castle.add(tower);
});

const icosahedron = new THREE.Object3D();
const icosahedronGeometry = new THREE.IcosahedronGeometry(0.8);
const icosahedronMaterial = new THREE.MeshStandardMaterial({ emissive: 0xff00ff });
const icosahedronLight = new THREE.PointLight(0xff00ff, 2);
icosahedron.add(icosahedronLight);
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
icosahedron.add(icosahedronMesh);
icosahedron.position.y = 3.5;
castle.add(icosahedron);

const doorGeometry = new THREE.BoxGeometry(1, 2, 1);
const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x554411 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.z = -1.1;
castle.add(door);

castle.position.y = 2.5;
castle.position.z = 3;
scene.add(castle);

// Lago
const lakeGeometry = new THREE.CircleGeometry(2);
const lakeMaterial = new THREE.MeshPhongMaterial({ color: 0x115577 });
const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
lake.lookAt(0, 10, 0);
lake.position.y = 1.51;
lake.position.z = -4;
lake.position.x = 1;
scene.add(lake);

// Árboles
const treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2);
const treeTrunkMaterial = new THREE.MeshPhongMaterial({ color: 0x554411 });
const treeLeavesGeometry = new THREE.SphereGeometry();
const treeLeavesMaterial = new THREE.MeshPhongMaterial({ color: GRASS_COLOR });
[{ x: -5, z: -1 }, { x: 3, z: -2 }, { x: -7, z: 2 }, { x: -1, z: -6 }].forEach(pos => {
  const tree = new THREE.Object3D();

  const treeTrunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
  tree.add(treeTrunk);

  const treeLeaves = new THREE.Mesh(treeLeavesGeometry, treeLeavesMaterial);
  treeLeaves.position.y = 2;
  tree.add(treeLeaves);

  tree.position.x = pos.x;
  tree.position.z = pos.z;
  tree.position.y = 2.5;
  scene.add(tree);
});

// Cámara
camera.position.z = -10;
camera.position.x = -6;
camera.position.y = 6;
camera.lookAt(0, 0, 0)

// Animación
function animate(time) {
  sunLight.position.x = 20 * Math.cos(time / 2000);
  sunLight.position.y = 20 * Math.sin(time / 2000);
  hemisphereLight.intensity = 0.75 + 0.25 * Math.sin(time / 2000);
  sunLight.lookAt(0, 0, 0);
  renderer.render(scene, camera);

  icosahedron.position.y = 2.75 + 0.25 * Math.sin(time / 500);
  icosahedron.rotation.x += 0.005;
  icosahedron.rotation.y += 0.007;
  icosahedron.rotation.z += 0.009;
}
renderer.setAnimationLoop(animate);

function updateWindowSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", updateWindowSize);
