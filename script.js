import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

let canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;



let renderer = new THREE.WebGLRenderer({canvas});

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
let scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(
  60,  // fov
  canvas.width/canvas.height,   // aspect
  0.1, // near
  500, // far
);
camera.position.set(160, 0, 70);
camera.lookAt(0, 0, 0);

const color = 'white';
const intensity = 0.5;
let lights = new THREE.PointLight(color, intensity);
lights.position.set(10,0,15);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();


let planeGeo = new THREE.PlaneGeometry(300, 200, 100, 100);
let planeMat = new THREE.MeshPhongMaterial({emissive: 'brown',  wireframe: false});
let mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.set(0, 0, 0);


scene.add(mesh);
scene.add(camera);
scene.add(lights);

let value, inc = new Array(), xOff = new Array(), j=0;
for (var i = 0; i < planeGeo.vertices.length; i++) {
	inc.push(Math.floor(10*Math.random()));
	xOff.push(planeGeo.vertices[i].x);

}
function animation() {
	planeGeo.verticesNeedUpdate = true;
		for (var i = 0; i < planeGeo.vertices.length; i++/*i+=inc[j]*/) {
			xOff[i] -= 0.5;
			value = Vector2D.map(perlin(xOff[i]/50, planeGeo.vertices[i].y/25), 0, 1, 0, 60);
			planeGeo.vertices[i].z = Math.abs(value);

		}
	renderer.render(scene, camera);
	requestAnimationFrame(animation);
}

controls.addEventListener('change', () => {
	renderer.render(scene, camera);
});

animation();
