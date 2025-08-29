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
const siderealPeriod = document.getElementById("sidereal_period");
const perihelion = document.getElementById("perihelion");
const aphelion = document.getElementById("aphelion");
const inclination = document.getElementById("inclination");
const equatorialDiameter = document.getElementById("equatorial_diameter");
const oblateness = document.getElementById("oblateness");
const mass = document.getElementById("mass");
const rotationPeriod = document.getElementById("rotation_period");
const tilt = document.getElementById("tilt");

const planetBtns = document.querySelectorAll('.planet-btn');
planetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log(btn.id);
        console.log(scene.getObjectByName(btn.id).children[0]);

        focusOnPlanet(scene.getObjectByName(btn.id).children[0]);
    })
})

const playPauseBtn = document.getElementById('play-pause-btn');
const playBtn = document.querySelector('.play');
const pauseBtn = document.querySelector('.pause');
playPauseBtn.addEventListener('click', () => {
    paused = !paused;
})


const topDownBtn = document.getElementById("top-down-btn");

topDownBtn.addEventListener('click', () => {
    camera.position.set(-22, 840, 130);
    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.update();
})

const standardBtn = document.getElementById("standard-btn");

standardBtn.addEventListener('click', () => {
    camera.position.set(0, 0, 480);
    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.update();
})

const menuClose = document.querySelector('.menu_close');

menuClose.addEventListener('click', () => {
    menu.classList.add('hidden');
    paused = false;
    camera.position.set(0,0,480);
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

        focusOnPlanet(selectedObject);
    }
}

function focusOnPlanet(planetMesh, factor = 4) {
    const target = new THREE.Vector3();
    planetMesh.getWorldPosition(target);

    // Get the planet radius
    const radius = planetMesh.geometry.parameters.radius;

    // Choose how far away we want to be
    const distance = radius * factor;

    // Fixed offset direction (for example, along Z axis)
    const offset = new THREE.Vector3(0, 0, distance);

    // Place camera at planet position + offset
    camera.position.copy(target.clone().add(offset));

    // Look at planet
    camera.lookAt(target);

    // If you're pausing OrbitControls, also reset its target
    controls.target.copy(target);
    controls.update();


    planetTitle.textContent = planetMesh.name;
    menu.classList.remove('hidden');

    // Pause Orbits
    paused = true;
    // Add Text Content
    siderealPeriod.textContent = planetMesh.planetData.siderealPeriod;
    perihelion.textContent = planetMesh.planetData.perihelion;
    aphelion.textContent = planetMesh.planetData.aphelion;
    inclination.textContent = planetMesh.planetData.inclination;
    equatorialDiameter.textContent = planetMesh.planetData.equatorialDiameter;
    oblateness.textContent = planetMesh.planetData.oblateness;
    mass.textContent = planetMesh.planetData.mass;
    rotationPeriod.textContent = planetMesh.planetData.rotationPeriod;
    tilt.textContent = planetMesh.planetData.tilt;
}

const textureLoader = new THREE.TextureLoader();

const planetData = [
    {
        name: "Mercury",
        radius: 2,
        x: 20,
        orbitSpeed: 0.0001,
        spinSpeed: 0.01,
        texture: "textures/mercury.jpg",
        data: {
            siderealPeriod: "87.97d",
            perihelion: "0.31AU",
            aphelion: "0.47AU",
            inclination: "7.0 deg",
            equatorialDiameter: "4,878km",
            oblateness: "0.0",
            mass: "0.06",
            rotationPeriod: "58.65d",
            tilt: "7 deg"
        }
    },
    {
        name: "Venus",
        radius: 4,
        x: 70,
        orbitSpeed: 0.0002,
        spinSpeed: 0.01,
        texture: "textures/venus.jpg",
        data: {
            siderealPeriod: "224.70d",
            perihelion: "0.72AU",
            aphelion: "0.73AU",
            inclination: "3.4 deg",
            equatorialDiameter: "12,100km",
            oblateness: "0.0",
            mass: "0.82",
            rotationPeriod: "243d",
            tilt: "177 deg"
        }
    },
    {
        name: "Earth",
        radius: 8,
        x: 120,
        orbitSpeed: 0.0003,
        spinSpeed: 0.01,
        texture: "textures/earth.jpg",
        data: {
            siderealPeriod: "365.26d",
            perihelion: "0.98AU",
            aphelion: "1.02AU",
            inclination: "0.0 deg",
            equatorialDiameter: "12,756km",
            oblateness: "0.0034",
            mass: "1.00",
            rotationPeriod: "23.934h",
            tilt: "23 deg"
        }
    },
    {
        name: "Mars",
        radius: 6,
        x: 160,
        orbitSpeed: 0.0004,
        spinSpeed: 0.01,
        texture: "textures/mars.jpg",
        data: {
            siderealPeriod: "686.98d",
            perihelion: "1.38AU",
            aphelion: "1.67AU",
            inclination: "1.8 deg",
            equatorialDiameter: "6,794km",
            oblateness: "0.005",
            mass: "0.11",
            rotationPeriod: "24.623h",
            tilt: "25 deg"
        }
    },
    {
        name: "Jupiter",
        radius: 20,
        x: 210,
        orbitSpeed: 0.0005,
        spinSpeed: 0.01,
        texture: "textures/jupiter.jpg",
        data: {
            siderealPeriod: "11.86y",
            perihelion: "4.95AU",
            aphelion: "5.45AU",
            inclination: "1.3 deg",
            equatorialDiameter: "142,800km",
            oblateness: "0.065",
            mass: "317.89",
            rotationPeriod: "9.842h",
            tilt: "3 deg"
        }
    },
    {
        name: "Saturn",
        radius: 15,
        x: 260,
        orbitSpeed: 0.0006,
        spinSpeed: 0.01,
        texture: "textures/saturn.jpg",
        data: {
            siderealPeriod: "29.46y",
            perihelion: "9.01AU",
            aphelion: "10.07AU",
            inclination: "2.5 deg",
            equatorialDiameter: "120,000km",
            oblateness: "0.108",
            mass: "95.17",
            rotationPeriod: "10.233h",
            tilt: "27 deg"
        }
    },
    {
        name: "Uranus",
        radius: 12,
        x: 310,
        orbitSpeed: 0.0007,
        spinSpeed: 0.01,
        texture: "textures/uranus.jpg",
        data: {
            siderealPeriod: "84.01y",
            perihelion: "18.28AU",
            aphelion: "20.09AU",
            inclination: "0.8 deg",
            equatorialDiameter: "52,400km",
            oblateness: "0.03",
            mass: "14.56",
            rotationPeriod: "16-28h",
            tilt: "98 deg"
        }
    },
    {
        name: "Neptune",
        radius: 10,
        x: 360,
        orbitSpeed: 0.0008,
        spinSpeed: 0.01,
        texture: "textures/neptune.jpg",
        data: {
            siderealPeriod: "164.79y",
            perihelion: "29.80AU",
            aphelion: "30.32AU",
            inclination: "1.8 deg",
            equatorialDiameter: "48,400km",
            oblateness: "0.02",
            mass: "17.24",
            rotationPeriod: "18-20h",
            tilt: "30 deg"
        }
    },
]

const planets = [];


planetData.forEach(planet => {
    const orbitGroup = new THREE.Group();
    orbitGroup.name = planet.name.toLowerCase();
    const texture = textureLoader.load(planet.texture);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(planet.radius, 15, 15);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry,material);

    mesh.position.x = planet.x;
    mesh.name = planet.name;
    mesh.planetDescription = planet.orbitSpeed;
    mesh.radius = planet.radius;
    mesh.planetData = planet.data;
    orbitGroup.add(mesh);

    planets.push({
        orbitGroup: orbitGroup, mesh: mesh, orbitSpeed: planet.orbitSpeed, spinSpeed: planet.spinSpeed, name:planet.name
    })
    scene.add(orbitGroup)
})



camera.position.z = 480;



function animate() {

    planets.forEach(planet => {
        if(!paused){
        planet.orbitGroup.rotation.y += planet.orbitSpeed
        }
        planet.mesh.rotation.y += planet.spinSpeed
    })

    if(paused) {
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden')
    } else {
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden')        
    }
    // console.log(camera.position)
    controls.update();
    renderer.render(scene, camera);

}