import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

const solarSystem = new THREE.Group();
solarSystem.position.set(-400,0,0)

const planets = [
    {
        name: "Mercury",
        radius: 2,
        x: -350,
    },
    {
        name: "Venus",
        radius: 4,
        x: -260,
    },
    {
        name: "Earth",
        radius: 8,
        x: -170,
    },
    {
        name: "Mars",
        radius: 6,
        x: -80,
    },
    {
        name: "Jupiter",
        radius: 20,
        x: 10,
    },
    {
        name: "Saturn",
        radius: 15,
        x: 100,
    },
    {
        name: "Uranus",
        radius: 12,
        x: 190,
    },
    {
        name: "Neptune",
        radius: 10,
        x: 280,
    },
]

const createPlanet = (planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 15, 15);
    const material = new THREE.MeshStandardMaterial({ color: 'green', wireframe: true });
    const mesh = new THREE.Mesh(geometry,material);

    mesh.position.x = planet.x;

    solarSystem.add(mesh);
}

planets.forEach((item,index) => {
    createPlanet(item, index);
})

scene.add(solarSystem);

camera.position.z = 35;
camera.position.x = -500;

function animate() {


    solarSystem.rotation.y += 0.01;
    renderer.render(scene, camera);

}