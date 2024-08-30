import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, container, font, text;

function setupThreeJs() {
	container = document.getElementById('container3D');

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x777777);
	scene = new THREE.Scene();

	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 3, 6);
	camera.lookAt(0, 0, 0);

	const controls = new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onResize);
	onResize();
}

function loadFont() {
	const loader = new FontLoader();
	loader.load('fonts/gentilis_regular.typeface.json', function (response) {
		font = response;
		buildScene();
	});
}

function buildScene() {
	const gridHelper = new THREE.GridHelper(10, 10);
	scene.add(gridHelper);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
	scene.add(hemisphereLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

	const coneGeometry = new THREE.ConeGeometry(0.25, 1);
	const coneMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
	const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
	coneMesh.position.set(-2, 0.5, -2);
	scene.add(coneMesh);

	let coneMesh2 = coneMesh.clone();
	coneMesh2.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
	coneMesh2.position.set(2, 0.5, -2);
	scene.add(coneMesh2);

	const parameters = {
		font: font,

		size: 0.6,
		height: 0.1,
		curveSegments: 2,

		bevelThickness: 0.1,
		bevelSize: 0,
		bevelEnabled: false,
	};

	let geo = new TextGeometry('3D', parameters);
	let mat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
	text = new THREE.Mesh(geo, mat);
	text.matrixAutoUpdate = false;
	window.text = text;

	const axesHelper = new THREE.AxesHelper(1);
	scene.add(axesHelper);

	const axesHelper2 = new THREE.AxesHelper(0.5);
	text.add(axesHelper2);
	scene.add(text);

	const loader = new GLTFLoader();
	loader.load('/models/targets.glb', function (gltf) {
		const targets = gltf.scene;
		scene.add(targets);
	});

	// *************************************************************************************
	//	Ejercicio:
	//	definir la matriz de transformación para cada uno de los 4 modelos en violeta
	//  y clonar el texto para cada uno de ellos
	//  Ayuda: las totaciones son multiplos de Math.PI/4 (radianes)
	//        las escalas son multiplos de 0.25
	// *************************************************************************************

	let copy1 = text.clone();
	let scaling = new THREE.Matrix4().makeScale(-1, 0.5, 1);
	let rotationY = new THREE.Matrix4().makeRotationY(Math.PI);
	let rotationX = new THREE.Matrix4().makeRotationX(-Math.PI / 4);
	let translation = new THREE.Matrix4().makeTranslation(2, 0, 0);
	let matrix = new THREE.Matrix4();
	matrix.multiply(translation).multiply(rotationX).multiply(scaling);
	copy1.matrix.copy(matrix);
	scene.add(copy1);


	let copy2 = text.clone();
	scaling = new THREE.Matrix4().makeScale(1, 2, 1);
	rotationY = new THREE.Matrix4().makeRotationY(Math.PI / 4);
	translation = new THREE.Matrix4().makeTranslation(0, 0, -1);
	matrix = new THREE.Matrix4();
	matrix.multiply(translation).multiply(rotationY).multiply(scaling);
	copy2.matrix.copy(matrix);
	scene.add(copy2);


	let copy3 = text.clone();
	scaling = new THREE.Matrix4().makeScale(2, 1, 1);
	rotationY = new THREE.Matrix4().makeRotationZ(Math.PI / 4);
	translation = new THREE.Matrix4().makeTranslation(-2, 0, 0);
	matrix = new THREE.Matrix4();
	matrix.multiply(translation).multiply(rotationY).multiply(scaling);
	copy3.matrix.copy(matrix);
	scene.add(copy3);


	let copy4 = text.clone();
	scaling = new THREE.Matrix4().makeScale(0.5, 1, 4);
	rotationY = new THREE.Matrix4().makeRotationY(Math.PI / 2);
	translation = new THREE.Matrix4().makeTranslation(-1, 0, 1);
	matrix = new THREE.Matrix4();
	matrix.multiply(translation).multiply(rotationY).multiply(scaling);
	copy4.matrix.copy(matrix);
	scene.add(copy4);

	// *************************************************************************************
}

function onResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

setupThreeJs();
loadFont();
animate();
