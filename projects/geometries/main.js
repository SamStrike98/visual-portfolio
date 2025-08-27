import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.getElementById("three-canvas");


const renderer = new THREE.WebGLRenderer({canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);


renderer.outputColorSpace = THREE.SRGBColorSpace;

const menu = document.querySelector(".menu");
const planetTitle = document.querySelector(".planet-title");
const planetDescription = document.querySelector(".planet-description");
const menuClose = document.querySelector('.menu_close');

menuClose.addEventListener('click', () => {
    menu.classList.add('hidden');
    paused = false;
})

let paused = false;

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.2);
sunLight.position.set(50,0,50);
scene.add(sunLight);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Raycaster
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),

    )
    raycaster.setFromCamera(coords, camera)
    const intersections = raycaster.intersectObjects(scene.children, true);
    if(intersections.length > 0){
        const selectedObject = intersections[0].object;
        console.log(selectedObject.name)
        console.log(selectedObject.planetDescription)
        planetTitle.textContent = selectedObject.name;
        planetDescription.textContent = selectedObject.planetDescription;
        menu.classList.remove('hidden');
        paused = true;
        console.log(selectedObject.position);
        console.log(camera);

        

    }
}



const textureLoader = new THREE.TextureLoader();

const planetData = [
    {
        name: "Mercury",
        radius: 2,
        x: 20,
        orbitSpeed: 0.0001,
        spinSpeed: 0.01,
        texture: "textures/mercury.jpg"
    },
    {
        name: "Venus",
        radius: 4,
        x: 70,
        orbitSpeed: 0.0002,
        spinSpeed: 0.01,
        texture: "textures/venus.jpg"
    },
    {
        name: "Earth",
        radius: 8,
        x: 120,
        orbitSpeed: 0.0003,
        spinSpeed: 0.01,
        texture: "textures/earth.jpg"
    },
    {
        name: "Mars",
        radius: 6,
        x: 160,
        orbitSpeed: 0.0004,
        spinSpeed: 0.01,
        texture: "textures/mars.jpg"
    },
    {
        name: "Jupiter",
        radius: 20,
        x: 210,
        orbitSpeed: 0.0005,
        spinSpeed: 0.01,
        texture: "textures/jupiter.jpg"
    },
    {
        name: "Saturn",
        radius: 15,
        x: 260,
        orbitSpeed: 0.0006,
        spinSpeed: 0.01,
        texture: "textures/saturn.jpg"
    },
    {
        name: "Uranus",
        radius: 12,
        x: 310,
        orbitSpeed: 0.0007,
        spinSpeed: 0.01,
        texture: "textures/uranus.jpg"
    },
    {
        name: "Neptune",
        radius: 10,
        x: 360,
        orbitSpeed: 0.0008,
        spinSpeed: 0.01,
        texture: "textures/neptune.jpg"
    },
]

const planets = [];


planetData.forEach(planet => {
    const orbitGroup = new THREE.Group();

    const texture = textureLoader.load(planet.texture);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(planet.radius, 15, 15);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry,material);

    mesh.position.x = planet.x;
    mesh.name = planet.name;
    mesh.planetDescription = planet.orbitSpeed;
    mesh.radius = planet.radius;
    orbitGroup.add(mesh);

    planets.push({
        orbitGroup: orbitGroup, mesh: mesh, orbitSpeed: planet.orbitSpeed, spinSpeed: planet.spinSpeed, name:planet.name
    })
    scene.add(orbitGroup)
})



camera.position.z = 50;



function animate() {

    planets.forEach(planet => {
        if(!paused){
        planet.orbitGroup.rotation.y += planet.orbitSpeed
        }
        planet.mesh.rotation.y += planet.spinSpeed
    })
    
    controls.update();
    renderer.render(scene, camera);

}