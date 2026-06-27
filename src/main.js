import * as THREE from 'three';
import {OrbitControls, Wireframe } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

class Ego {
  constructor(camera){
    this.camera = camera;
    this.mouse = new THREE.Vector2();
    this.clicking = false;
    this._bindInput();

    // steering tuning
    this.turnSpeed = 2; // how fast cursor steers
    this.lookLambda = 5; // follow-smoothing rate => lower = less snappy
    this.maxPitch = 1.2 // clamp in radians

    // orientation states | angles (rad): yaw = x, pitch = y
    this.targetYaw = this.targetPitch = 0; // instant follow
    this.yaw = this.pitch = 0; // lagged camera follow
    this.camera.rotation.order = 'YXZ';

  }

  update(delta){
    // immediate ego target
    this.targetYaw -= this.mouse.x * this.turnSpeed * delta;
    this.targetPitch += this.mouse.y * this.turnSpeed * delta;
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch, -this.maxPitch, this.maxPitch); // blocks y-roll

    // camera lag
    const k = 1 - Math.exp(-this.lookLambda * delta);
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.targetYaw, k);
    this.pitch = THREE.MathUtils.lerp(this.pitch, this.targetPitch, k);

    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

  }

  _bindInput(){
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = ((event.clientX / window.innerWidth) * 2 - 1)
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
    })
    window.addEventListener('mousedown', () => {this.clicking = true; });
    window.addEventListener('mouseup', () => {this.clicking = false; });
  }

}

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const ego = new Ego(camera);
ego._bindInput();

camera.position.set(2, 2, 2);
// camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight); // (_, _, updateStyle: false)?
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

// const mouse = new THREE.Vector2();



// GUI
const gui = new GUI();
const guiActions = {
  zeroPos() {
    camera.position.set(5, 5, 5);
  }
}
gui.add(camera.position, 'x', -50, 50, 0.5).listen();
gui.add(camera.position, 'y', -50, 50, 0.5).listen();
gui.add(camera.position, 'z', -50, 50, 0.5).listen();
gui.add(guiActions, 'zeroPos').name('zeroPos');

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshLambertMaterial({color: 0x330099});
const cube =  new THREE.Mesh(geometry, material);
// edges
const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(cube.geometry),
  new THREE.LineBasicMaterial( {color: 'rgba(41, 0, 144, 0.87)'}));
cube.add(edges);
scene.add(cube);

// -- choppy FPControls -- 
// const control = new FirstPersonControls(camera, renderer.domElement);
// control.autoForward = true;
// gui.add(control, 'autoForward');
// gui.add(control, 'movementSpeed', 0, 100);
// control.movementSpeed = 0.5


//lights
function setUpLights(x, y, z){
  const light1 = new THREE.DirectionalLight();
  light1.position.set(x, y, z);
  scene.add(light1)

  const light2 = new THREE.AmbientLight('#ff0011', 0.5);
  light2.position.set(x*2, y*-2, z*4)
  scene.add(light2)
}
setUpLights(5, 11, 8);



// object gen draft
function object_gen(size, amnt){

    const geometry = new THREE.TorusGeometry(size, size/6, size+2, 70, 80);
    const material = new THREE.MeshPhongMaterial( {color: 'rgb(60, 0, 255)'})
    material.wireframe = true;

    for (let i = 1; i < amnt; i++){
        
        const qube = new THREE.Mesh(geometry, material);
        qube.position.set(i*2*(-1)**-1, i, i*2*(-1)**i);
        setUpLights(i*2*(-1)**i, 4*i*(-1)**i, i*6*(-1)**i);
        scene.add(qube);
    }
}
// grid & axis helpers
const grid = new THREE.GridHelper(100, 1000, 0x2332fe, 0xFF531F);
const axes = new THREE.AxesHelper(10);
scene.add(grid, axes);

object_gen(2, 10)


// render loop
function animate(time){
  cube.rotation.x +=  0.01;
  cube.rotation.y += 0.02;
  // camera.position.x = mouse.x * 4
  // camera.position.y = mouse.y * 5
  // camera.position.z -= 0.005

  const delta = clock.getDelta(); // can change per frame to per second to standardize rates
  ego.update(delta);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})
renderer.setAnimationLoop(animate);
