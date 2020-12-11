let rF = document.querySelector('#rf');
let rA = document.querySelector('#ra');
let rS = document.querySelector('#rs');
let range = document.querySelectorAll('input');
let scale = 40, octaves=4, lacunarity=0.6, persistance=1.2;
//let scale = 50, valueL=0, octaves=5, lacunarity=0.71, persistance=2.1;

range.forEach(x => {
	x.addEventListener('change', (e) => {
		ctx.clearRect(0,0,canvas.width, canvas.height);
		lacunarity = rF.value;
		persistance = rA.value;
		scale = rS.value;

		animation();
	});
});

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let s = new Shapes(ctx);

canvas.width = 400;
canvas.height = 400;


addEventListener('resize', function(e) {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});


let inc = 0;
function animation() {
	
	//xOff[i] -= 0.5;
	
	for (var x = 0; x < canvas.width; x+=2) {
		for (var y = 0; y < canvas.height; y+=2) {
			let amp = 1;
			let fre = 1;
			let noiseHeight = 0;
			for (var i = 0; i < octaves; i++) {
				let p = perlin(x/scale*fre, y/scale*fre);
				noiseHeight += p*amp;
				amp *= persistance;
				fre *= lacunarity;
			}
			s.circle(x, y, 1);
			if (noiseHeight < 0) {
				s.fill('rgb(0,90,255, 0.8)');
				//console.log(noiseHeight);
			}else if(noiseHeight < 0.1) {
				s.fill('rgb(155, 55, 0, 0.5)');
			}else if(noiseHeight < 0.8) {
				s.fill('rgb(155, 55, 0, 0.8)');
			}else if(noiseHeight < 1.5) {
				s.fill('rgb(0, 0, 0, 0.8)');
			}
			//s.fill(`rgba(${/*Math.abs*/(noiseHeight)*255},${/*Math.abs*/(noiseHeight)*255},${/*Math.abs*/(noiseHeight)*255})`);
		}
	}
	//inc+= 0.01;
	
	//requestAnimationFrame(animation);
}
animation();