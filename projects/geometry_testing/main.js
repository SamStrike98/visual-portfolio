import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Lighting
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const geometry2 = new THREE.TorusKnotGeometry(3.5, 1.5, 8, 64, 2, 3)
const knot = new THREE.Mesh(geometry2, material);
scene.add(knot);

camera.position.z = 15;

function animate() {

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    knot.rotation.x += 0.01;
    knot.rotation.y += 0.01;

    renderer.render(scene, camera);

}