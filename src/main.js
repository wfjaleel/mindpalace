import * as THREE from 'three';
import {OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer()

// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshLambertMaterial({color: 330099});
const cube =  new THREE.Mesh(geometry, material);

// orbit
const controls = new OrbitControls(camera, renderer.domElement);
const mouse = new THREE.Vector2();
// const direction = new THREE.Vector3();
 

window.addEventListener('mousemove', (event) => {
  mouse.x = ((event.clientX / window.innerWidth) * 2 - 1)
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
})

window.addEventListener('')

// edges
const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(cube.geometry),
  new THREE.LineBasicMaterial( {color: 'rgba(41, 0, 144, 0.87)'}));
cube.add(edges);


//lights
function setUpLights(){
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 2, 4);
  scene.add(light1)

  const light2 = new THREE.AmbientLight('#ff0011', 30);
  light2.position.set(2, 3, 2)
  scene.add(light2)
}
setUpLights();
scene.add(cube);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

// world draft
function world_gen(cube_size, amnt){

    const geometry = new THREE.BoxGeometry(cube_size, cube_size, cube_size);
    const material = new THREE.MeshBasicMaterial( {color: 'rgb(60, 0, 255)'})

    for (let i = 1; i < amnt; i++){
        const qube = new THREE.Mesh(geometry, material);
        qube.position.set(i*2*(-1)^-1, 4*i*(-1)^i, i*6*(-1)^i);
        scene.add(qube);
    }
}


world_gen(2, 10)



function animate(time){
  cube.rotation.x +=  0.01;
  cube.rotation.y += 0.02;
  camera.position.x = mouse.x * 4
  camera.position.y = mouse.y * 5
  // camera.getWorldDirection(direction);
  // camera.position.add(direction*0.0005);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})
renderer.setAnimationLoop(animate);

