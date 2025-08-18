import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(- 1, 2, 4);
scene.add(light);


const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const cubeGenerator = (geometry, color, x) => {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
}

const cubes = [
    cubeGenerator(geometry, 0x44aa88, 0),
    cubeGenerator(geometry, 0x8844aa, - 2),
    cubeGenerator(geometry, 0xaa8844, 2),
];

camera.position.z = 5;

function animate() {


    cubes.forEach((cube, ndx) => {

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

    });


    renderer.render(scene, camera);

}