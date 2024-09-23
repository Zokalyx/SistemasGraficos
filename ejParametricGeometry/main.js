import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ParametricGeometry } from "three/examples/jsm/Addons.js";

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(0, 0, 10);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

function rectanguloRotado() {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 0);
    shape.lineTo(-1, 2);
    shape.lineTo(1, 2);
    shape.lineTo(1, -2);
    shape.lineTo(-1, -2);
    shape.closePath();

    return function (u, v, target) {
        const puntoForma = new THREE.Vector3(shape.getPointAt(u).x, 0, shape.getPointAt(u).y);
        const matrizTraslacion = new THREE.Matrix4().makeTranslation(0, 10 * v, 0);
        const matrizRotation = new THREE.Matrix4().makeRotationY(3 * 2 * Math.PI * v);

        puntoForma.applyMatrix4(matrizRotation).applyMatrix4(matrizTraslacion);

        target.set(puntoForma.x, puntoForma.y, puntoForma.z);
    }
}

function ovaloRaro() {
    return function (u, v, target) {
        u *= 2 * Math.PI;
        v *= 2 * Math.PI;
        const puntoOvalo = new THREE.Vector3(1 * Math.cos(u), 0, -1 * Math.sin(u));
        const matrizTraslacion = new THREE.Matrix4().makeTranslation(0, 1.5 * v, 0);
        const matrizEscalado = new THREE.Matrix4().makeScale(1 + 0.5 * Math.cos(5 * v), 0, 1 - 0.5 * Math.cos(5 * v));

        puntoOvalo.applyMatrix4(matrizEscalado).applyMatrix4(matrizTraslacion);
        target.set(puntoOvalo.x, puntoOvalo.y, puntoOvalo.z);
    }
}

const geometry1 = new ParametricGeometry(rectanguloRotado(), 100, 100);
const material1 = new THREE.MeshPhongMaterial({ color: 0xffffff });
const mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.translateX(-5);
mesh1.translateY(-5);
scene.add(mesh1);

const geometry2 = new ParametricGeometry(ovaloRaro(), 100, 100);
const material2 = new THREE.MeshPhongMaterial({ color: 0xffffff });
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.translateX(5);
mesh2.translateY(-5);
scene.add(mesh2);

const light = new THREE.AmbientLight();
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
