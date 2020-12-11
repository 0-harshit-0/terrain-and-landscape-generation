  
import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';

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
  2000, // far
);
camera.position.set(350, 0, 70);
camera.lookAt(0, 0, 0);

const color = 'white';
const intensity = 0.5;
let lights = new THREE.PointLight(color, intensity);
lights.position.set(500,0, 105);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();


let planeGeo = new THREE.PlaneGeometry(1000, 1000, 200, 200);
let planeMat = new THREE.MeshPhongMaterial({emissive: 'brown',  wireframe: false});
let mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.set(0, 0, 0);


scene.add(mesh);
scene.add(camera);
scene.add(lights);

let inc = new Array(), xOff = new Array(), j=0;
let scale = 3, valueL=0, octaves=4, lacunarity=0.25, persistance=7;
//let scale = 0.1, valueL=0, octaves=5, lacunarity=0.013, persistance=25;

/*for (var i = 0; i < planeGeo.vertices.length; i++) {
	inc.push(Math.floor(10*Math.random()));
	xOff.push(planeGeo.vertices[i].x);

}*/
function animation() {
	planeGeo.verticesNeedUpdate = true;
	let len = planeGeo.vertices.length;

	for (var i = 0; i < len; i++/*i+=inc[j]*/) {
		let amp = 1;
		let fre = 1;
		let noiseHeight = 0;
		//xOff[i] -= 0.5;
		for (var j = 0; j < octaves; j++) {
			let sampleX = planeGeo.vertices[i].x/scale*fre;
			let sampleY = planeGeo.vertices[i].y/scale*fre;
			valueL = perlin(sampleX, sampleY);
			noiseHeight += valueL*amp;

			amp *= persistance;
			fre *= lacunarity;
		}
		if (noiseHeight < 0) {
			noiseHeight = Math.random();
		}
		planeGeo.vertices[i].z = noiseHeight;
	}

	renderer.render(scene, camera);
	//requestAnimationFrame(animation);
}

controls.addEventListener('change', () => {
	//mesh.rotateX = 180;
	renderer.render(scene, camera);
});

animation();
