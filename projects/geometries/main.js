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


const planetData = [
    {
        name: "Mercury",
        radius: 2,
        x: 20,
        orbitSpeed: 0.01,
        spinSpeed: 0.01
    },
    {
        name: "Venus",
        radius: 4,
        x: 70,
        orbitSpeed: 0.02,
        spinSpeed: 0.01
    },
    {
        name: "Earth",
        radius: 8,
        x: 120,
        orbitSpeed: 0.03,
        spinSpeed: 0.01
    },
    {
        name: "Mars",
        radius: 6,
        x: 160,
        orbitSpeed: 0.04,
        spinSpeed: 0.01
    },
    {
        name: "Jupiter",
        radius: 20,
        x: 210,
        orbitSpeed: 0.05,
        spinSpeed: 0.01
    },
    {
        name: "Saturn",
        radius: 15,
        x: 260,
        orbitSpeed: 0.06,
        spinSpeed: 0.01
    },
    {
        name: "Uranus",
        radius: 12,
        x: 310,
        orbitSpeed: 0.07,
        spinSpeed: 0.01
    },
    {
        name: "Neptune",
        radius: 10,
        x: 360,
        orbitSpeed: 0.08,
        spinSpeed: 0.01
    },
]

const planets = [];


planetData.forEach(planet => {
    const orbitGroup = new THREE.Group();


    const geometry = new THREE.SphereGeometry(planet.radius, 15, 15);
    const material = new THREE.MeshStandardMaterial({ color: 'green', wireframe: true });
    const mesh = new THREE.Mesh(geometry,material);

    mesh.position.x = planet.x;
    orbitGroup.add(mesh);

    planets.push({
        orbitGroup: orbitGroup, mesh: mesh, orbitSpeed: planet.orbitSpeed, spinSpeed: planet.spinSpeed
    })
    scene.add(orbitGroup)
})



camera.position.z = 35;


function animate() {

    planets.forEach(planet => {
        planet.orbitGroup.rotation.y += planet.orbitSpeed
        planet.mesh.rotation.y += planet.spinSpeed
    })
    
    controls.update();
    renderer.render(scene, camera);

}