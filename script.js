import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';


function fade(t) {
	return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a0, a1, w) {
	return fade(1.0 - w)*a0 + fade(w)*a1;
}

class Gradient{
	constructor() {
		this.vector2 = new Vector2D();
	}
	
	randomGradient(a, b) {
		let random = 2920 * Math.sin(a * 21942.0 + b * 171324.0 + 8912.0) * Math.cos(a * 23157.0 + b * 217832.0 + 9758.0);
		return this.vector2 = new Vector2D(Math.cos(random), Math.sin(random));
	}
	dotGridGradient(ia, ib, a, b) {
		let gradient = this.randomGradient(ia, ib);

		// Compute the distance vector
		let dx = a - ia;
		let dy = b - ib;
		
		// Compute the dot-product
		return (dx*gradient.x + dy*gradient.y);
	}
}
let gr = new Gradient();
function perlin(a, b) {
    // Determine grid cell coordinates
    let x0 = Math.floor(a);
    let x1 = x0 + 1;
    let y0 = Math.floor(b);
    let y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    let sx = a - x0;
    let sy = b - y0;

    // Interpolate between grid point gradients
    let n0, n1, ia0, ia1, value;

    n0 = gr.dotGridGradient(x0, y0, a, b);
    n1 = gr.dotGridGradient(x1, y0, a, b);
    ia0 = lerp(n0, n1, sx);

    n0 = gr.dotGridGradient(x0, y1, a, b);
    n1 = gr.dotGridGradient(x1, y1, a, b);
    ia1 = lerp(n0, n1, sx);

    value = lerp(ia0, ia1, sy);
    return value;
}

//perlin end

let canvas = document.querySelector('#canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;



let renderer = new THREE.WebGLRenderer({canvas});

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
let scene = new THREE.Scene();
scene.background = new THREE.Color('black');

/*const left = -canvas.width / 2;
const right = canvas.width / 2;
const top = canvas.height / 2;
const bottom = -canvas.height / 2;
const near = -1;
const far = 1;
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
camera.zoom = 0.2;
camera.position.set(0, 10, 20);*/


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
